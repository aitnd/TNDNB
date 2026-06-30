import React, { useState } from 'react';
import { FaTimes, FaUserPlus, FaSpinner, FaExclamationTriangle } from 'react-icons/fa'; 
import { initializeApp, getApp } from 'firebase/app'; 
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { collection, query, where, getDocs, doc, setDoc, updateDoc, arrayUnion, serverTimestamp } from 'firebase/firestore';
import { db, firebaseConfig } from '../services/firebaseClient';
import { BadgeService } from '../services/badgeService';
import { clearUserHistory } from '../services/historyService';

interface CreateStudentModalProps {
    courseId: string;
    courseName: string;
    licenseId?: string;
    onClose: () => void;
    onSuccess: () => void;
}

interface SingleConflict {
    uid: string;
    email: string;
    account: string;
    oldName: string;
    oldCourseName?: string;
    isLocked?: boolean;
    newName: string;
}

const CreateStudentModal: React.FC<CreateStudentModalProps> = ({ courseId, courseName, licenseId, onClose, onSuccess }) => {
    const [sbd, setSbd] = useState('');
    const [fullName, setFullName] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [password, setPassword] = useState('123456');
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState('');

    // Single conflict state
    const [conflict, setConflict] = useState<SingleConflict | null>(null);

    const handleSubmitCheck = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsProcessing(true);

        try {
            const cleanSbd = sbd.trim();
            const email = `${cleanSbd}@daotaothuyenvien.com`;

            // Pre-check Firestore for existing SBD account
            const q = query(collection(db, 'users'), where('email', '==', email));
            const snap = await getDocs(q);

            if (!snap.empty) {
                const docSnap = snap.docs[0];
                const oldDoc = docSnap.data();
                setConflict({
                    uid: docSnap.id,
                    email,
                    account: cleanSbd,
                    oldName: oldDoc.fullName || oldDoc.full_name || 'Học viên cũ',
                    oldCourseName: oldDoc.courseName || oldDoc.class || 'Chưa xếp lớp',
                    isLocked: !!oldDoc.isLocked,
                    newName: fullName.trim()
                });
                setIsProcessing(false);
                return;
            }

            // If clean, execute creation
            await executeCreateUser(email, false);
        } catch (err: any) {
            console.error("Error checking student creation:", err);
            setError(err.message || 'Có lỗi xảy ra.');
            setIsProcessing(false);
        }
    };

    const handleConfirmOverwrite = async () => {
        if (!conflict) return;
        if (!conflict.isLocked) {
            const confirmMsg = `⚠️ CẢNH BÁO BẢO MẬT:\n\nTài khoản SBD "${conflict.account}" (${conflict.oldName}) VẪN ĐANG HOẠT ĐỘNG (Chưa khóa).\n\nBạn có CHẮC CHẮN muốn xóa sạch dữ liệu cũ và ghi đè thông tin học viên mới "${conflict.newName}" không?`;
            if (!window.confirm(confirmMsg)) {
                return;
            }
        }
        setIsProcessing(true);
        try {
            await executeCreateUser(conflict.email, true, conflict.uid);
        } catch (err: any) {
            console.error("Error overwriting student:", err);
            setError(err.message || 'Lỗi khi ghi đè tài khoản.');
            setIsProcessing(false);
        }
    };

    const executeCreateUser = async (email: string, isOverwrite: boolean, existingUid?: string) => {
        const secondaryAppName = "SecondaryAppForManualCreate";
        let secondaryApp;
        try {
            secondaryApp = getApp(secondaryAppName);
        } catch (e) {
            secondaryApp = initializeApp(firebaseConfig, secondaryAppName);
        }
        const secondaryAuth = getAuth(secondaryApp);

        try {
            let uid = existingUid || '';

            if (!isOverwrite) {
                try {
                    const userCredential = await createUserWithEmailAndPassword(secondaryAuth, email, password);
                    uid = userCredential.user.uid;
                } catch (authError: any) {
                    if (authError.code === 'auth/email-already-in-use') {
                        // Fallback in case pre-check missed it
                        const existingUser = await signInWithEmailAndPassword(secondaryAuth, email, password);
                        uid = existingUser.user.uid;
                        isOverwrite = true;
                    } else {
                        throw authError;
                    }
                }
            } else {
                // Sign in to ensure auth credentials/UID are verified
                try {
                    const existingUser = await signInWithEmailAndPassword(secondaryAuth, email, password);
                    uid = existingUser.user.uid;
                } catch (loginErr: any) {
                    if (loginErr.code === 'auth/wrong-password' || loginErr.code === 'auth/invalid-credential') {
                        throw new Error('Tài khoản đã tồn tại nhưng mật khẩu nhập vào không khớp với mật khẩu cũ.');
                    }
                }
            }

            if (uid) {
                // If overwriting existing account, reset old badges and exam history
                if (isOverwrite) {
                    await BadgeService.resetUserBadges(uid);
                    await clearUserHistory(uid);
                }

                await setDoc(doc(db, 'users', uid), {
                    fullName: fullName.trim(),
                    email: email,
                    role: 'hoc_vien',
                    birthDate: birthDate.trim(),
                    courseId: courseId,
                    courseName: courseName,
                    class: courseName,
                    isVerified: true,
                    isLocked: false,
                    defaultLicenseId: licenseId || null,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                    photoURL: `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName.trim())}&background=random`
                }, { merge: true });

                await updateDoc(doc(db, 'courses', courseId), {
                    students: arrayUnion(uid)
                });

                alert(isOverwrite ? `Đã ghi đè & reset dữ liệu thành công cho tài khoản SBD: ${sbd}` : `Đã tạo tài khoản thành công cho học viên: ${fullName}`);
                onSuccess();
                onClose();
            }
        } finally {
            await signOut(secondaryAuth);
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

                {conflict ? (
                    <div className="space-y-4">
                        <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 p-4 rounded-xl text-sm">
                            <h3 className="font-bold text-amber-800 dark:text-amber-300 flex items-center gap-2 text-base mb-2">
                                <FaExclamationTriangle /> Phát Hiện SBD Đã Tồn Tại!
                            </h3>
                            <p className="text-amber-700 dark:text-amber-200 mb-3">
                                Số báo danh <strong className="font-mono">{conflict.account}</strong> đã được đăng ký cho một học viên trước đó.
                            </p>
                            <div className="space-y-2 bg-white dark:bg-slate-800 p-3 rounded-lg border border-amber-100 dark:border-slate-700">
                                <div><span className="text-gray-500">Học viên cũ:</span> <strong>{conflict.oldName}</strong> ({conflict.oldCourseName})</div>
                                <div>
                                    <span className="text-gray-500">Trạng thái:</span>{' '}
                                    {conflict.isLocked ? (
                                        <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded font-bold">🔒 Đã khóa</span>
                                    ) : (
                                        <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded font-bold">🟢 Đang hoạt động</span>
                                    )}
                                </div>
                                <div className="pt-1 border-t border-gray-100 dark:border-slate-700">
                                    <span className="text-gray-500">Học viên mới:</span> <strong className="text-blue-600">{conflict.newName}</strong>
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
                                <FaExclamationTriangle /> {error}
                            </div>
                        )}

                        <div className="flex flex-col gap-2 pt-2">
                            <button
                                onClick={handleConfirmOverwrite}
                                disabled={isProcessing}
                                className="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold shadow transition flex items-center justify-center gap-2 disabled:opacity-70"
                            >
                                {isProcessing ? <><FaSpinner className="animate-spin" /> Đang xử lý...</> : <>♻️ Ghi đè & Reset Dữ Liệu Cũ</>}
                            </button>
                            <button
                                onClick={() => setConflict(null)}
                                disabled={isProcessing}
                                className="w-full py-2 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 text-gray-700 dark:text-gray-200 rounded-lg font-medium text-sm transition"
                            >
                                Quay lại nhập SBD khác
                            </button>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmitCheck} className="space-y-4">
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
                                {isProcessing ? <><FaSpinner className="animate-spin" /> Đang kiểm tra...</> : 'Tạo tài khoản'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default CreateStudentModal;
