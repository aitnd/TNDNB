import React, { useState } from 'react';
import { FaTimes, FaUserPlus, FaSpinner, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { initializeApp, getApp, deleteApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc, updateDoc, arrayUnion, serverTimestamp } from 'firebase/firestore';
import { db, firebaseConfig } from '../services/firebaseClient';

interface CreateStudentModalProps {
    courseId: string;
    courseName: string;
    licenseId?: string;
    onClose: () => void;
    onSuccess: () => void;
}

const CreateStudentModal: React.FC<CreateStudentModalProps> = ({ courseId, courseName, licenseId, onClose, onSuccess }) => {
    const [sbd, setSbd] = useState('');
    const [fullName, setFullName] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [password, setPassword] = useState('123456');
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState('');

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsProcessing(true);

        // Initialize Secondary App
        const secondaryAppName = "SecondaryAppForManualCreate";
        let secondaryApp;
        try {
            secondaryApp = getApp(secondaryAppName);
        } catch (e) {
            secondaryApp = initializeApp(firebaseConfig, secondaryAppName);
        }
        const secondaryAuth = getAuth(secondaryApp);

        try {
            const email = `${sbd.trim()}@daotaothuyenvien.com`;

            // 1. Create User in Auth
            let uid = '';
            try {
                const userCredential = await createUserWithEmailAndPassword(secondaryAuth, email, password);
                uid = userCredential.user.uid;
            } catch (authError: any) {
                if (authError.code === 'auth/email-already-in-use') {
                    throw new Error('Số báo danh này đã tồn tại trong hệ thống.');
                } else {
                    throw authError;
                }
            }

            if (uid) {
                // 2. Create/Update Firestore Doc
                await setDoc(doc(db, 'users', uid), {
                    fullName: fullName.trim(),
                    email: email,
                    role: 'hoc_vien',
                    birthDate: birthDate,
                    courseId: courseId,
                    courseName: courseName,
                    class: courseName,
                    isVerified: true,
                    defaultLicenseId: licenseId || null,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                    photoURL: `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName.trim())}&background=random`
                }, { merge: true });

                // 3. Add to Course
                await updateDoc(doc(db, 'courses', courseId), {
                    students: arrayUnion(uid)
                });

                alert(`Đã tạo tài khoản thành công cho học viên: ${fullName}`);
                onSuccess();
                onClose();
            }

        } catch (err: any) {
            console.error("Error creating student:", err);
            setError(err.message || 'Có lỗi xảy ra.');
        } finally {
            await signOut(secondaryAuth);
            // deleteApp(secondaryApp); // Optional cleanup
            setIsProcessing(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-md p-6 relative" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 bg-gray-100 dark:bg-slate-700 p-2 rounded-full"><FaTimes /></button>

                <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-blue-600">
                    <FaUserPlus /> Thêm Học Viên Thủ Công
                </h2>

                <form onSubmit={handleCreate} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Số Báo Danh (SBD) <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            value={sbd}
                            onChange={e => setSbd(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                            placeholder="Ví dụ: TMK3-001"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Họ và Tên <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            value={fullName}
                            onChange={e => setFullName(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                            placeholder="Ví dụ: Nguyễn Văn A"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Ngày sinh</label>
                        <input
                            type="text"
                            value={birthDate}
                            onChange={e => setBirthDate(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                            placeholder="DD/MM/YYYY"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Mật khẩu mặc định</label>
                        <input
                            type="text"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none dark:bg-slate-700 dark:border-slate-600 dark:text-white bg-gray-100"
                        />
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
                            <FaExclamationTriangle /> {error}
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-slate-700 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={isProcessing}
                            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-lg transition flex items-center gap-2 disabled:opacity-70"
                        >
                            {isProcessing ? <><FaSpinner className="animate-spin" /> Đang tạo...</> : 'Tạo tài khoản'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateStudentModal;
