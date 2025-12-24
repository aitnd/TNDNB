import { db } from './firebaseClient';
import { supabase } from './supabaseClient';
import { doc, getDoc, collection, addDoc, serverTimestamp, query, where, getDocs, orderBy } from 'firebase/firestore';
import { UserProfile } from '../types';
import { saveResultOffline } from './offlineService';


export const getDefaultAvatar = (role?: string) => {
    const r = (role || '').toLowerCase();
    // Student
    if (r === 'hoc_vien' || r === 'student' || r === 'hoc-vien') {
        return 'assets/img/avatar1.webp';
    }
    // Teachers and others (admin, quan_ly, lanh_dao, giao_vien)
    return 'assets/img/avatar.webp';
};

/**
 * Resizes an image file to WebP format using Canvas.
 * Max size: 500x500px.
 * Quality: 0.8
 */
export const resizeImageToWebP = (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
                const maxWidth = 350;
                const maxHeight = 350;
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > maxWidth) {
                        height *= maxWidth / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width *= maxHeight / height;
                        height = maxHeight;
                    }
                }

                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    reject(new Error('Canvas context not available'));
                    return;
                }
                ctx.drawImage(img, 0, 0, width, height);
                canvas.toBlob((blob) => {
                    if (blob) {
                        resolve(blob);
                    } else {
                        reject(new Error('WebP conversion failed'));
                    }
                }, 'image/webp', 0.6);
            };
            img.onerror = (err) => reject(err);
        };
        reader.onerror = (err) => reject(err);
    });
};

/**
 * Uploads an avatar image to Supabase Storage and returns the public URL.
 */
export const uploadAvatar = async (file: File, userId: string): Promise<string> => {
    try {
        const webpBlob = await resizeImageToWebP(file);
        const fileName = `${userId}_${Date.now()}.webp`;
        const filePath = `avatars/${fileName}`;

        // 1. Upload to Supabase 'avatars' bucket
        const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(filePath, webpBlob, {
                cacheControl: '3600',
                upsert: true
            });

        if (uploadError) {
            console.error('Supabase upload error:', uploadError);
            throw uploadError;
        }

        // 2. Get Public URL
        const { data } = supabase.storage
            .from('avatars')
            .getPublicUrl(filePath);

        return data.publicUrl;
    } catch (error) {
        console.error('Error uploading avatar:', error);
        throw error;
    }
};

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
        const userDocRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userDocRef);

        if (userSnap.exists()) {
            const data = userSnap.data();
            // Map Firestore data to UserProfile type
            return {
                id: userId,
                email: data.email,
                full_name: data.fullName || data.full_name || 'Người dùng',
                role: (() => {
                    const r = data.role;
                    if (r === 'teacher' || r === 'giao-vien' || r === 'giao_vien') return 'giao_vien';
                    if (r === 'student' || r === 'hoc-vien' || r === 'hoc_vien') return 'hoc_vien';
                    if (r === 'manager' || r === 'quan-ly' || r === 'quan_ly') return 'quan_ly';
                    if (r === 'leader' || r === 'lanh-dao' || r === 'lanh_dao') return 'lanh_dao';
                    if (r === 'admin') return 'admin';
                    return 'hoc_vien';
                })(),
                photoURL: data.photoURL || getDefaultAvatar(data.role),
                birthDate: data.birthDate || '',
                address: data.address || '',
                class: data.class || '',
                phoneNumber: data.phoneNumber || '',
                courseName: data.courseName || '',
                courseId: data.courseId || '',
            } as UserProfile;
        }
        return null; // Document does not exist
    } catch (error) {
        console.error('Error fetching user profile from Firestore:', error);
        throw error; // RETHROW to let caller handle network/permission errors
    }
};

export const saveExamResult = async (
    userId: string,
    licenseId: string,
    licenseName: string,
    subjectName: string | null,
    examType: 'Ôn tập' | 'Thi thử',
    score: number,
    totalQuestions: number,
    timeTaken: number
) => {
    try {
        let title = licenseName;
        if (examType === 'Ôn tập' && subjectName) {
            title = `${licenseName} / ${subjectName}`;
        } else if (examType === 'Thi thử') {
            title = `${licenseName} (Thi thử)`;
        }

        if (navigator.onLine) {
            await addDoc(collection(db, 'exam_results'), {
                studentId: userId,
                licenseId: licenseId,
                score: score,
                totalQuestions: totalQuestions,
                timeTaken: timeTaken,
                completedAt: serverTimestamp(),
                type: examType,
                quizTitle: title
            });
        } else {
            // Lưu offline
            await saveResultOffline({
                userId,
                licenseId,
                licenseName,
                subjectName,
                examType,
                score,
                totalQuestions,
                timeSpent: timeTaken,
                createdAt: Date.now()
            });
        }
    } catch (error) {
        console.error('Error saving exam result:', error);
        // Fallback lưu offline nếu lỗi mạng đột ngột
        try {
            await saveResultOffline({
                userId,
                licenseId,
                licenseName,
                subjectName,
                examType,
                score,
                totalQuestions,
                timeSpent: timeTaken,
                createdAt: Date.now()
            });
        } catch (e) {
            console.error('Critical: Failed to save result even offline', e);
        }
    }
};

export const getExamHistory = async (userId: string) => {
    try {
        const q = query(
            collection(db, 'exam_results'),
            where('studentId', '==', userId),
            orderBy('completedAt', 'desc')
        );

        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                completedAt: data.completedAt?.toDate().toISOString() || new Date().toISOString()
            };
        });
    } catch (error) {
        console.error('Error fetching exam history from Firestore:', error);
        return [];
    }
};

// FETCH CLASSES (COURSES) FROM 'courses' COLLECTION
export const getAllClasses = async (): Promise<{ id: string, name: string }[]> => {
    try {
        const q = query(collection(db, 'courses'));
        const snap = await getDocs(q);
        const courses: { id: string, name: string }[] = [];
        snap.forEach(doc => {
            const data = doc.data();
            if (data.name) {
                courses.push({ id: doc.id, name: data.name });
            }
        });
        return courses.sort((a, b) => a.name.localeCompare(b.name));
    } catch (error) {
        console.error("Error fetching courses:", error);
        return [];
    }
};

export const searchUsersByEmail = async (term: string): Promise<UserProfile[]> => {
    try {
        if (!term || term.length < 3) return [];
        // Simple prefix search
        const q = query(
            collection(db, 'users'),
            where('email', '>=', term),
            where('email', '<=', term + '\uf8ff')
        );
        const snap = await getDocs(q);
        return snap.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                email: data.email,
                full_name: data.fullName || data.full_name || 'Người dùng',
                role: (() => {
                    const r = data.role;
                    if (r === 'teacher' || r === 'giao-vien') return 'giao_vien';
                    if (r === 'student' || r === 'hoc-vien') return 'hoc_vien';
                    if (r === 'manager' || r === 'quan-ly') return 'quan_ly';
                    if (r === 'leader' || r === 'lanh-dao') return 'lanh_dao';
                    return r || 'hoc_vien';
                })(),
                photoURL: data.photoURL || getDefaultAvatar(data.role),
                birthDate: data.birthDate || '',
                address: data.address || '',
                class: data.class || '',
                phoneNumber: data.phoneNumber || '',
                courseName: data.courseName || '',
                courseId: data.courseId || '',
            } as UserProfile;
        });
    } catch (error) {
        console.error("Error searching users:", error);
        return [];
    }
};
