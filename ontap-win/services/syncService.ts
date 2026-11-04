import { auth, db } from './firebaseClient';
import { collection, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { db_offline, getUnsyncedResults, markResultAsSynced, saveLicensesOffline } from './offlineService';
import { fetchQuestionsSnapshot } from './d1Client';

export const fetchAndSaveQuestions = async (): Promise<boolean> => {
  if (!navigator.onLine) return false;
  try {
    const snapshot = await fetchQuestionsSnapshot();
    if (snapshot && Array.isArray(snapshot.licenses) && snapshot.licenses.length > 0) {
      await saveLicensesOffline(snapshot.licenses);
      
      localStorage.setItem('questions_last_sync', Date.now().toString());
      localStorage.setItem('questions_version', snapshot.version.toString());
      localStorage.setItem('questions_content_hash', snapshot.contentHash || '');
      localStorage.setItem(
        'questions_last_count',
        snapshot.licenses.flatMap(l => (l.subjects || []).flatMap(s => s.questions || [])).length.toString()
      );
      return true;
    }
    return false;
  } catch (err) {
    console.error('Failed to fetch and save questions from D1:', err);
    return false;
  }
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

        // 2. Tải ngân hàng câu hỏi mới nhất từ D1 về máy
        await fetchAndSaveQuestions();

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
