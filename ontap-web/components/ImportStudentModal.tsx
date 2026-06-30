import React, { useState, useRef } from 'react';
import { FaTimes, FaFileExcel, FaUpload, FaCheckCircle, FaExclamationTriangle, FaSpinner } from 'react-icons/fa';
import * as XLSX from '@sheetjs/xlsx';
import { initializeApp, getApp } from 'firebase/app';  
import { getAuth, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { collection, query, where, getDocs, doc, setDoc, updateDoc, arrayUnion, serverTimestamp } from 'firebase/firestore';
import { db, firebaseConfig } from '../services/firebaseClient';
import { BadgeService } from '../services/badgeService';
import { clearUserHistory } from '../services/historyService';

interface ImportStudentModalProps {
    courseId: string;
    courseName: string;
    licenseId?: string;
    onClose: () => void;
    onSuccess: () => void;
}

interface ParsedStudent {
    stt: string;
    fullName: string;
    birthDate: string;
    address: string;
    cccd: string;
    account: string;
    password: string;
    status: 'pending' | 'success' | 'error';
    message?: string;
}

interface ConflictItem {
    studentIndex: number;
    email: string;
    account: string;
    oldName: string;
    oldCourseName?: string;
    isLocked?: boolean;
    newName: string;
    action: 'overwrite' | 'skip';
}

const ImportStudentModal: React.FC<ImportStudentModalProps> = ({ courseId, courseName, licenseId, onClose, onSuccess }) => {
    const [file, setFile] = useState<File | null>(null);
    const [parsedData, setParsedData] = useState<ParsedStudent[]>([]);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [progress, setProgress] = useState<number>(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Conflict resolution state
    const [conflicts, setConflicts] = useState<ConflictItem[]>([]);
    const [showConflictStep, setShowConflictStep] = useState<boolean>(false);
    const [isCheckingConflicts, setIsCheckingConflicts] = useState<boolean>(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            handleFileUpload(selectedFile);
        }
    };

    const handleFileUpload = (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = new Uint8Array(e.target?.result as ArrayBuffer);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const json: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            const students: ParsedStudent[] = [];
            for (let i = 1; i < json.length; i++) {
                const row = json[i];
                if (row && row.length >= 2) {
                    const stt = row[0]?.toString() || i.toString();
                    const fullName = row[1]?.toString() || '';
                    const birthDate = row[2]?.toString() || '';
                    const address = row[3]?.toString() || '';
                    const cccd = row[4]?.toString() || '';
                    const account = row[5]?.toString() || '';
                    const password = row[6]?.toString() || '123456';

                    if (!fullName || !account) continue;

                    students.push({
                        stt,
                        fullName,
                        birthDate,
                        address,
                        cccd,
                        account,
                        password,
                        status: 'pending'
                    });
                }
            }
            setParsedData(students);
            setShowConflictStep(false);
            setConflicts([]);
        };
        reader.readAsArrayBuffer(file);
    };

    const checkConflictsAndProcess = async () => {
        if (parsedData.length === 0) return;
        setIsCheckingConflicts(true);
        const detectedConflicts: ConflictItem[] = [];

        try {
            for (let i = 0; i < parsedData.length; i++) {
                const student = parsedData[i];
                const email = student.account.includes('@') ? student.account : `${student.account}@daotaothuyenvien.com`;
                const q = query(collection(db, 'users'), where('email', '==', email));
                const snap = await getDocs(q);
                if (!snap.empty) {
                    const oldDoc = snap.docs[0].data();
                    detectedConflicts.push({
                        studentIndex: i,
                        email,
                        account: student.account,
                        oldName: oldDoc.fullName || oldDoc.full_name || 'Học viên cũ',
                        oldCourseName: oldDoc.courseName || oldDoc.class || 'Chưa xếp lớp',
                        isLocked: !!oldDoc.isLocked,
                        newName: student.fullName,
                        action: oldDoc.isLocked ? 'overwrite' : 'skip'
                    });
                }
            }
        } catch (err) {
            console.error("Error pre-checking conflicts:", err);
        } finally {
            setIsCheckingConflicts(false);
        }

        if (detectedConflicts.length > 0) {
            setConflicts(detectedConflicts);
            setShowConflictStep(true);
        } else {
            processImport([]);
        }
    };

    const handleConfirmImport = () => {
        const activeOverwrites = conflicts.filter(c => !c.isLocked && c.action === 'overwrite');
        if (activeOverwrites.length > 0) {
            const names = activeOverwrites.map(c => `• Tài khoản: ${c.account} (Tên cũ: ${c.oldName})`).join('\n');
            const confirmMsg = `⚠️ XÁC NHẬN BẢO MẬT:\nPhát hiện ${activeOverwrites.length} tài khoản VẪN ĐANG HOẠT ĐỘNG (Chưa khóa) được chọn Ghi đè & Reset:\n\n${names}\n\nBạn có CHẮC CHẮN muốn xóa sạch dữ liệu cũ và ghi đè thông tin học viên mới cho các tài khoản này không?`;
            if (!window.confirm(confirmMsg)) {
                return;
            }
        }
        processImport(conflicts);
    };

    const processImport = async (activeConflicts: ConflictItem[] = conflicts) => {
        if (parsedData.length === 0) return;
        setShowConflictStep(false);
        setIsProcessing(true);
        setProgress(0);

        const conflictMap = new Map<number, ConflictItem>();
        activeConflicts.forEach(c => conflictMap.set(c.studentIndex, c));

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
            const conflict = conflictMap.get(i);

            if (conflict && conflict.action === 'skip') {
                results[i].status = 'error';
                results[i].message = 'Đã bỏ qua (Giữ nguyên tài khoản cũ)';
                setParsedData([...results]);
                setProgress(Math.round(((i + 1) / results.length) * 100));
                continue;
            }

            try {
                const email = student.account.includes('@') ? student.account : `${student.account}@daotaothuyenvien.com`;
                let uid = '';
                let isExisting = false;

                try {
                    const userCredential = await createUserWithEmailAndPassword(secondaryAuth, email, student.password || '123456');
                    uid = userCredential.user.uid;
                } catch (authError: any) {
                    if (authError.code === 'auth/email-already-in-use') {
                        isExisting = true;
                        try {
                            const { signInWithEmailAndPassword } = await import('firebase/auth');
                            const existingUser = await signInWithEmailAndPassword(secondaryAuth, email, student.password || '123456');
                            uid = existingUser.user.uid;
                        } catch (loginErr: any) {
                            if (loginErr.code === 'auth/wrong-password' || loginErr.code === 'auth/invalid-credential') {
                                throw new Error('Tài khoản đã tồn tại nhưng mật khẩu không khớp trong Excel.');
                            }
                            throw loginErr;
                        }
                    } else {
                        throw authError;
                    }
                }

                if (uid) {
                    // Reset old badges and history if account is being overwritten/reused
                    if (isExisting || conflict) {
                        await BadgeService.resetUserBadges(uid);
                        await clearUserHistory(uid);
                    }

                    await setDoc(doc(db, 'users', uid), {
                        fullName: student.fullName,
                        email: email,
                        role: 'hoc_vien',
                        birthDate: student.birthDate,
                        address: student.address,
                        cccd: student.cccd,
                        courseId: courseId,
                        courseName: courseName,
                        class: courseName,
                        isVerified: true,
                        isLocked: false,
                        defaultLicenseId: licenseId || null,
                        createdAt: serverTimestamp(),
                        updatedAt: serverTimestamp(),
                        photoURL: `https://ui-avatars.com/api/?name=${encodeURIComponent(student.fullName)}&background=random`
                    }, { merge: true });

                    await updateDoc(doc(db, 'courses', courseId), {
                        students: arrayUnion(uid)
                    });

                    results[i].status = 'success';
                    successCount++;
                }

            } catch (error: any) {
                console.error(`Error importing ${student.account}:`, error);
                results[i].status = 'error';
                results[i].message = error.message;
            }

            setParsedData([...results]);
            setProgress(Math.round(((i + 1) / results.length) * 100));
        }

        await signOut(secondaryAuth);
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
        const ws = XLSX.utils.aoa_to_sheet([
            ['STT', 'Họ và tên', 'Ngày sinh', 'Địa chỉ', 'CCCD', 'Tài khoản', 'Mật khẩu'],
            [1, 'Nguyễn Văn A', '01/01/1990', 'TP. Hồ Chí Minh', '079123456789', 'nguyenvana', '123456'],
            [2, 'Trần Thị B', '15/05/1995', 'Hà Nội', '012345678901', 'tranthib', '123456']
        ]);
        ws['!cols'] = [
            { wch: 5 },   { wch: 25 },  { wch: 14 },  { wch: 25 },  { wch: 16 },  { wch: 18 },  { wch: 12 },
        ];
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

                {!showConflictStep && (
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
                )}

                {showConflictStep ? (
                    <div className="flex-1 flex flex-col overflow-hidden">
                        <div className="bg-amber-50 dark:bg-amber-900/30 p-3 rounded-lg border border-amber-200 dark:border-amber-700 mb-3 text-sm text-amber-800 dark:text-amber-200">
                            <strong>⚠️ Phát hiện tài khoản trùng lặp!</strong> Bạn có thể chọn Ghi đè & Reset cho bất kỳ tài khoản nào (bao gồm tài khoản đang hoạt động sau khi xác nhận).
                        </div>
                        <div className="flex-1 overflow-y-auto border border-gray-200 dark:border-slate-700 rounded-lg mb-4">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 dark:bg-slate-700 sticky top-0">
                                    <tr>
                                        <th className="p-3 font-semibold">Tài khoản</th>
                                        <th className="p-3 font-semibold">Học viên CŨ (Lớp)</th>
                                        <th className="p-3 font-semibold">Trạng thái Cũ</th>
                                        <th className="p-3 font-semibold">Học viên MỚI (Excel)</th>
                                        <th className="p-3 font-semibold text-center">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                                    {conflicts.map((item, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-slate-700/50">
                                            <td className="p-3 font-mono font-bold text-blue-600">{item.account}</td>
                                            <td className="p-3">
                                                <div className="font-medium">{item.oldName}</div>
                                                <div className="text-xs text-gray-500">{item.oldCourseName}</div>
                                            </td>
                                            <td className="p-3">
                                                {item.isLocked ? (
                                                    <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded font-semibold">🔒 Đã khóa</span>
                                                ) : (
                                                    <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded font-semibold">🟢 Hoạt động</span>
                                                )}
                                            </td>
                                            <td className="p-3 font-medium text-green-600">{item.newName}</td>
                                            <td className="p-3 text-center">
                                                <select
                                                    value={item.action}
                                                    onChange={(e) => {
                                                        const newAction = e.target.value as 'overwrite' | 'skip';
                                                        if (newAction === 'overwrite' && !item.isLocked) {
                                                            if (!window.confirm(`⚠️ TÀI KHOẢN ĐANG HOẠT ĐỘNG!\n\nTài khoản "${item.account}" (${item.oldName}) chưa bị khóa.\nBạn có chắc chắn muốn chọn Ghi đè & Reset dữ liệu cho học viên này không?`)) {
                                                                return;
                                                            }
                                                        }
                                                        setConflicts(prev => prev.map((c, i) => i === idx ? { ...c, action: newAction } : c));
                                                    }}
                                                    className="border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 rounded px-2 py-1 text-xs font-semibold"
                                                >
                                                    <option value="overwrite">♻️ Ghi đè & Reset</option>
                                                    <option value="skip">⛔ Bỏ qua (Keep Old)</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="flex justify-between items-center pt-3 border-t border-gray-100 dark:border-slate-700">
                            <button
                                onClick={() => setShowConflictStep(false)}
                                className="px-4 py-2 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-medium"
                            >
                                Quay lại Danh sách
                            </button>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setConflicts(prev => prev.map(c => ({ ...c, action: c.isLocked ? 'overwrite' : 'skip' })))}
                                    className="px-3 py-2 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-lg text-xs font-medium"
                                >
                                    Tự động chọn theo trạng thái
                                </button>
                                <button
                                    onClick={handleConfirmImport}
                                    className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-bold shadow-lg"
                                >
                                    Xác nhận & Bắt đầu Import
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* PREVIEW TABLE */}
                        <div className="flex-1 overflow-y-auto border border-gray-200 dark:border-slate-700 rounded-lg mb-4">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 dark:bg-slate-700 sticky top-0">
                                    <tr>
                                        <th className="p-3 font-semibold">STT</th>
                                        <th className="p-3 font-semibold">Họ và tên</th>
                                        <th className="p-3 font-semibold">Ngày sinh</th>
                                        <th className="p-3 font-semibold">Địa chỉ</th>
                                        <th className="p-3 font-semibold">CCCD</th>
                                        <th className="p-3 font-semibold">Tài khoản</th>
                                        <th className="p-3 font-semibold">Trạng thái</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                                    {parsedData.map((row, idx) => (
                                        <tr key={idx} className={row.status === 'error' ? 'bg-red-50 dark:bg-red-900/20' : row.status === 'success' ? 'bg-green-50 dark:bg-green-900/20' : ''}>
                                            <td className="p-3">{row.stt}</td>
                                            <td className="p-3">{row.fullName}</td>
                                            <td className="p-3">{row.birthDate}</td>
                                            <td className="p-3">{row.address}</td>
                                            <td className="p-3">{row.cccd}</td>
                                            <td className="p-3">{row.account}</td>
                                            <td className="p-3">
                                                {row.status === 'pending' && <span className="text-gray-500">Chờ xử lý</span>}
                                                {row.status === 'success' && <span className="text-green-600 flex items-center gap-1"><FaCheckCircle /> Thành công</span>}
                                                {row.status === 'error' && <span className="text-red-600 flex items-center gap-1"><FaExclamationTriangle /> {row.message}</span>}
                                            </td>
                                        </tr>
                                    ))}
                                    {parsedData.length === 0 && (
                                        <tr>
                                            <td colSpan={7} className="p-10 text-center text-gray-500 italic">
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
                                onClick={checkConflictsAndProcess}
                                disabled={isProcessing || isCheckingConflicts || parsedData.length === 0}
                                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 shadow-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isCheckingConflicts ? <><FaSpinner className="animate-spin" /> Đang kiểm tra trùng lặp...</> : isProcessing ? <><FaSpinner className="animate-spin" /> Đang xử lý {progress}%</> : 'Thực hiện Import'}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ImportStudentModal;
