import React, { useState, useRef } from 'react';
import { FaTimes, FaFileExcel, FaUpload, FaCheckCircle, FaExclamationTriangle, FaSpinner } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import { initializeApp, getApp, getApps, deleteApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc, updateDoc, arrayUnion, serverTimestamp } from 'firebase/firestore';
import { db, firebaseConfig } from '../services/firebaseClient';

interface ImportStudentModalProps {
    courseId: string;
    courseName: string;
    licenseId?: string;
    onClose: () => void;
    onSuccess: () => void;
}

interface ParsedStudent {
    sbd: string;
    fullName: string;
    birthDate: string;
    password?: string;
    status: 'pending' | 'success' | 'error';
    message?: string;
}

const ImportStudentModal: React.FC<ImportStudentModalProps> = ({ courseId, courseName, licenseId, onClose, onSuccess }) => {
    const [file, setFile] = useState<File | null>(null);
    const [parsedData, setParsedData] = useState<ParsedStudent[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            parseExcel(selectedFile);
        }
    };

    const parseExcel = (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = new Uint8Array(e.target?.result as ArrayBuffer);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            // Assuming Header is Row 1 (Index 0)
            // Data starts from Row 2 (Index 1)
            // Columns: A=SBD, B=FullName, C=BirthDate, D=Password (Optional)

            const students: ParsedStudent[] = [];

            // Skip header row
            for (let i = 1; i < jsonData.length; i++) {
                const row = jsonData[i];
                if (!row || row.length === 0) continue;

                const sbd = row[0]?.toString().trim();
                const fullName = row[1]?.toString().trim();

                if (sbd && fullName) {
                    let birthDate = row[2];
                    // Handle Excel Date format if necessary, or assume string
                    if (typeof birthDate === 'number') {
                        // Excel date serial to JS Date
                        const date = new Date(Math.round((birthDate - 25569) * 86400 * 1000));
                        birthDate = date.toLocaleDateString('vi-VN'); // DD/MM/YYYY
                    } else {
                        birthDate = birthDate?.toString().trim() || '';
                    }

                    const password = row[3]?.toString().trim() || '123456';

                    students.push({
                        sbd,
                        fullName,
                        birthDate,
                        password,
                        status: 'pending'
                    });
                }
            }
            setParsedData(students);
        };
        reader.readAsArrayBuffer(file);
    };

    const processImport = async () => {
        if (parsedData.length === 0) return;
        setIsProcessing(true);
        setProgress(0);

        // Initialize Secondary App
        const secondaryAppName = "SecondaryAppForImport";
        let secondaryApp;
        try {
            secondaryApp = getApp(secondaryAppName);
        } catch (e) {
            secondaryApp = initializeApp(firebaseConfig, secondaryAppName);
        }
        const secondaryAuth = getAuth(secondaryApp);

        const results = [...parsedData];
        let successCount = 0;

        for (let i = 0; i < results.length; i++) {
            const student = results[i];
            try {
                const email = `${student.sbd}@daotaothuyenvien.com`;

                // 1. Create User in Auth
                let uid = '';
                try {
                    const userCredential = await createUserWithEmailAndPassword(secondaryAuth, email, student.password || '123456');
                    uid = userCredential.user.uid;
                } catch (authError: any) {
                    if (authError.code === 'auth/email-already-in-use') {
                        // If user exists, we might want to find their UID or skip.
                        // Since we can't get UID by email easily without Admin SDK, we might have to skip or assume SBD is unique enough to query Firestore?
                        // For now, let's mark as error or "Already Exists"
                        // Actually, if we use Admin SDK on backend it's easier. On client, we are limited.
                        // Let's try to see if we can just update the Firestore doc if we know the ID? 
                        // But we don't know the UID if we can't login.
                        // WORKAROUND: We can't easily get UID of existing user on client without logging in.
                        // We will mark as "Email đã tồn tại".
                        throw new Error('Tài khoản (SBD) đã tồn tại.');
                    } else {
                        throw authError;
                    }
                }

                if (uid) {
                    // 2. Create/Update Firestore Doc
                    await setDoc(doc(db, 'users', uid), {
                        fullName: student.fullName,
                        email: email,
                        role: 'hoc_vien',
                        birthDate: student.birthDate,
                        courseId: courseId,
                        courseName: courseName,
                        class: courseName,
                        isVerified: true,
                        defaultLicenseId: licenseId || null,
                        createdAt: serverTimestamp(),
                        updatedAt: serverTimestamp(),
                        photoURL: `https://ui-avatars.com/api/?name=${encodeURIComponent(student.fullName)}&background=random`
                    }, { merge: true });

                    // 3. Add to Course
                    await updateDoc(doc(db, 'courses', courseId), {
                        students: arrayUnion(uid)
                    });

                    results[i].status = 'success';
                    successCount++;
                }

            } catch (error: any) {
                console.error(`Error importing ${student.sbd}:`, error);
                results[i].status = 'error';
                results[i].message = error.message;
            }

            setParsedData([...results]);
            setProgress(Math.round(((i + 1) / results.length) * 100));
        }

        // Cleanup
        await signOut(secondaryAuth);
        // We don't delete the app immediately to avoid issues if we reuse it, but typically good to clean up if possible.
        // deleteApp(secondaryApp); 

        setIsProcessing(false);
        if (successCount === results.length) {
            alert(`Đã import thành công ${successCount} học viên!`);
            onSuccess();
            onClose();
        } else {
            alert(`Đã xử lý xong. Thành công: ${successCount}, Lỗi: ${results.length - successCount}`);
        }
    };

    const downloadTemplate = () => {
        // Create a dummy workbook
        const ws = XLSX.utils.aoa_to_sheet([
            ['SBD', 'Họ và tên', 'Ngày sinh', 'Mật khẩu (Tùy chọn)'],
            ['TS001', 'Nguyễn Văn A', '01/01/1990', '123456'],
            ['TS002', 'Trần Thị B', '15/05/1995', '']
        ]);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Mau_Import");
        XLSX.writeFile(wb, "Mau_Danh_Sach_Hoc_Vien.xlsx");
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-4xl p-6 h-[80vh] flex flex-col relative" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 bg-gray-100 dark:bg-slate-700 p-2 rounded-full"><FaTimes /></button>

                <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-green-600">
                    <FaFileExcel /> Import Học Viên từ Excel
                </h2>

                <div className="flex gap-4 mb-6">
                    <button
                        onClick={downloadTemplate}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition"
                    >
                        Tải file mẫu
                    </button>
                    <div className="relative">
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept=".xlsx, .xls"
                            className="hidden"
                        />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition flex items-center gap-2"
                        >
                            <FaUpload /> Chọn file Excel
                        </button>
                    </div>
                </div>

                {/* PREVIEW TABLE */}
                <div className="flex-1 overflow-y-auto border border-gray-200 dark:border-slate-700 rounded-lg mb-4">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 dark:bg-slate-700 sticky top-0">
                            <tr>
                                <th className="p-3 font-semibold">SBD</th>
                                <th className="p-3 font-semibold">Họ tên</th>
                                <th className="p-3 font-semibold">Ngày sinh</th>
                                <th className="p-3 font-semibold">Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                            {parsedData.map((row, idx) => (
                                <tr key={idx} className={row.status === 'error' ? 'bg-red-50 dark:bg-red-900/20' : row.status === 'success' ? 'bg-green-50 dark:bg-green-900/20' : ''}>
                                    <td className="p-3">{row.sbd}</td>
                                    <td className="p-3">{row.fullName}</td>
                                    <td className="p-3">{row.birthDate}</td>
                                    <td className="p-3">
                                        {row.status === 'pending' && <span className="text-gray-500">Chờ xử lý</span>}
                                        {row.status === 'success' && <span className="text-green-600 flex items-center gap-1"><FaCheckCircle /> Thành công</span>}
                                        {row.status === 'error' && <span className="text-red-600 flex items-center gap-1"><FaExclamationTriangle /> {row.message}</span>}
                                    </td>
                                </tr>
                            ))}
                            {parsedData.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="p-10 text-center text-gray-500 italic">
                                        Chưa có dữ liệu. Vui lòng tải file Excel lên.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* FOOTER ACTION */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-slate-700">
                    <div className="text-sm text-gray-500">
                        {parsedData.length > 0 && `Tìm thấy ${parsedData.length} học viên.`}
                    </div>
                    <button
                        onClick={processImport}
                        disabled={isProcessing || parsedData.length === 0}
                        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 shadow-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isProcessing ? <><FaSpinner className="animate-spin" /> Đang xử lý {progress}%</> : 'Thực hiện Import'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ImportStudentModal;
