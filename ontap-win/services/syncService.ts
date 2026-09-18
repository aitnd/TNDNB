import { auth, db } from './firebaseClient';
import { collection, query, where, getDocs, addDoc, serverTimestamp, doc, updateDoc, getDoc } from 'firebase/firestore';
import { db_offline, getUnsyncedResults, markResultAsSynced, saveLicensesOffline } from './offlineService';
import { fetchLicenses } from './dataService';
import { supabase } from './supabaseClient';
import type { License } from '../types';

interface AnswerRow { id: string; text: string }
interface QuestionRow { id: string; text: string; image?: string | null; correct_answer_id: string; answers?: AnswerRow[] | null }
interface SubjectRow { id: string; name: string; questions?: QuestionRow[] | null }
interface LicenseRow { id: string; name: string; subjects?: SubjectRow[] | null }

export const fetchAndSaveQuestions = async (): Promise<boolean> => {
  if (!navigator.onLine) return false;
  try {
    const { data } = await supabase
      .from('licenses')
      .select(`id, name, display_order, subjects (id, name, display_order, questions (*, answers (id, text)))`)
      .order('display_order', { ascending: true });

    if (data) {
      const licenses: License[] = (data as LicenseRow[]).map((license) => ({
        id: license.id, name: license.name,
        subjects: (license.subjects || []).map((s) => ({
          id: s.id, name: s.name,
          questions: (s.questions || []).map((q) => ({
            id: q.id, text: q.text, image: q.image ?? undefined,
            correctAnswerId: q.correct_answer_id,
            answers: (q.answers || []).map((a) => ({ id: a.id, text: a.text })),
          })),
        })),
      }));
      await saveLicensesOffline(licenses);
      
      localStorage.setItem('questions_last_sync', Date.now().toString());
      localStorage.setItem('questions_last_count', licenses.flatMap(l => l.subjects.flatMap(s => s.questions)).length.toString());
      return true;
    }
    return false;
  } catch { return false; }
};

export const syncData = async (userId: string) => {
    if (!navigator.onLine) return;

    try {

        // 1. Đồng bộ kết quả thi từ Offline lên Online
        const unsyncedResults = await getUnsyncedResults();
        for (const res of unsyncedResults) {
            try {
                let title = res.licenseName;
                if (res.examType === 'Ôn tập' && res.subjectName) {
                    title = `${res.licenseName} / ${res.subjectName}`;
                } else if (res.examType === 'Thi thử') {
                    title = `${res.licenseName} (Thi thử)`;
                }

                await addDoc(collection(db, 'exam_results'), {
                    studentId: res.userId,
                    licenseId: res.licenseId,
                    score: res.score,
                    totalQuestions: res.totalQuestions,
                    timeTaken: res.timeSpent,
                    completedAt: serverTimestamp(),
                    type: res.examType,
                    quizTitle: title,
                    isPassed: res.isPassed,
                    offlineCreatedAt: res.createdAt // Giữ lại thời gian làm bài thực tế
                });
                if (res.id) await markResultAsSynced(res.id);
            } catch (err) {
                console.error('Failed to sync result:', err);
            }
        }

        // 2. Tải ngân hàng câu hỏi mới nhất về máy
        const licenses = await fetchLicenses();
        await saveLicensesOffline(licenses);

        // 3. Kiểm tra và cập nhật Profile (Xử lý xung đột)
        const userDocRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userDocRef);
        if (userSnap.exists()) {
            const serverProfile = userSnap.data();
            const localProfile = await db_offline.users.get(userId);

            if (localProfile) {
                // Logic so sánh thời gian (Last Write Wins)
                const serverTime = serverProfile.updatedAt?.toMillis?.() || serverProfile.updatedAt || 0;
                const localTime = localProfile.updatedAt || 0;

                if (serverTime > localTime) {
                    await db_offline.users.update(userId, {
                        full_name: serverProfile.full_name,
                        role: serverProfile.role,
                        updatedAt: serverTime,
                        lastSynced: Date.now()
                    });
                } else if (localTime > serverTime) {
                    // Nếu cho phép sửa offline, ta sẽ update lên server ở đây.
                    // Hiện tại app chưa cho sửa offline, nên trường hợp này hiếm khi xảy ra
                    // trừ khi đồng hồ máy tính sai lệch.
                    // Tuy nhiên, để an toàn và đúng logic, ta có thể update ngược lại:
                    /*
                    await updateDoc(userDocRef, {
                        full_name: localProfile.full_name,
                        updatedAt: serverTimestamp()
                    });
                    */
                }
            }
        }

    } catch (error) {
        console.error('❌ Sync failed:', error);
    }
};

// Tự động đồng bộ khi có mạng lại
window.addEventListener('online', () => {
    const user = auth.currentUser;
    if (user) syncData(user.uid);
});
