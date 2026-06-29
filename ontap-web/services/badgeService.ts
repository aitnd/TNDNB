import { db } from './firebaseClient';
import { collection, doc, getDoc, getDocs, setDoc, updateDoc, query, serverTimestamp, writeBatch } from 'firebase/firestore';

export interface UserBadgeProgress {
  badgeId: string;
  unlockedAt?: any; // Firestore Timestamp
  isNew: boolean;
  currentProgress?: number;
  isUnlocked: boolean;
}

export const BadgeService = {
  /**
   * Lấy toàn bộ tiến trình huy hiệu của một user
   */
  getUserBadges: async (uid: string): Promise<UserBadgeProgress[]> => {
    try {
      const q = query(collection(db, 'users', uid, 'userBadges'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        badgeId: doc.id,
        ...doc.data()
      })) as UserBadgeProgress[];
    } catch (error) {
      console.error('Error fetching user badges:', error);
      return [];
    }
  },

  /**
   * Cập nhật tiến trình của một huy hiệu (ví dụ: số câu đã làm)
   * Tự động unlock nếu đạt targetValue
   * @returns true nếu huy hiệu vừa được unlock trong lần gọi này
   */
  updateBadgeProgress: async (uid: string, badgeId: string, progress: number, targetValue: number): Promise<boolean> => {
    // Ánh xạ ID cũ tránh chồng chéo
    if (badgeId === 'achievement_1') badgeId = 'lan_dau_ra_khoi';
    if (badgeId === 'achievement_perfect') badgeId = 'diem_tuyet_doi';

    try {
      const badgeRef = doc(db, 'users', uid, 'userBadges', badgeId);
      const badgeDoc = await getDoc(badgeRef);
      
      const isUnlockingNow = progress >= targetValue;

      if (badgeDoc.exists()) {
         const data = badgeDoc.data();
         if (data.isUnlocked) {
            // Vẫn cập nhật tiến trình nếu số câu tăng lên
            if (data.currentProgress !== progress) {
               await updateDoc(badgeRef, { currentProgress: progress });
            }
            return false; 
         }

         await updateDoc(badgeRef, {
           currentProgress: progress,
           ...(isUnlockingNow && { 
               isUnlocked: true, 
               unlockedAt: serverTimestamp(), 
               isNew: true 
           })
         });
         return isUnlockingNow;
      } else {
         await setDoc(badgeRef, {
           currentProgress: progress,
           isUnlocked: isUnlockingNow,
           ...(isUnlockingNow && { 
               unlockedAt: serverTimestamp(), 
               isNew: true 
           })
         });
         return isUnlockingNow;
      }
    } catch (error) {
       console.error('Error updating badge progress:', error);
       return false;
    }
  },

  /**
   * Mở khóa trực tiếp một huy hiệu (dùng cho các sự kiện 1 lần như: thi lần đầu)
   * @returns true nếu huy hiệu vừa được unlock thành công
   */
  unlockBadge: async (uid: string, badgeId: string): Promise<boolean> => {
    // Ánh xạ ID cũ tránh chồng chéo
    if (badgeId === 'achievement_1') badgeId = 'lan_dau_ra_khoi';
    if (badgeId === 'achievement_perfect') badgeId = 'diem_tuyet_doi';

    try {
      const badgeRef = doc(db, 'users', uid, 'userBadges', badgeId);
      const badgeDoc = await getDoc(badgeRef);
      
      if (badgeDoc.exists() && badgeDoc.data().isUnlocked) {
          return false; // Đã unlock rồi
      }

      await setDoc(badgeRef, {
        isUnlocked: true,
        unlockedAt: serverTimestamp(),
        isNew: true
      }, { merge: true });
      return true;
    } catch (error) {
       console.error('Error unlocking badge:', error);
       return false;
    }
  },

  /**
   * Tăng tiến trình câu ôn tập đã làm tích lũy của học viên
   */
  increasePracticeProgress: async (uid: string, questionsCount: number): Promise<void> => {
    try {
      const ref = doc(db, 'users', uid, 'userBadges', 'thuy_thu_cham_chi');
      const docSnap = await getDoc(ref);
      let current = 0;
      if (docSnap.exists()) {
        current = docSnap.data().currentProgress || 0;
      }
      const newProgress = current + questionsCount;

      // Cập nhật tiến trình cho 4 huy hiệu ôn tập tương ứng
      await BadgeService.updateBadgeProgress(uid, 'tan_binh_tren_bo', newProgress, 1);
      await BadgeService.updateBadgeProgress(uid, 'thuy_thu_cham_chi', newProgress, 50);
      await BadgeService.updateBadgeProgress(uid, 'hoa_tieu_kien_thuc', newProgress, 200);
      await BadgeService.updateBadgeProgress(uid, 'bac_thay_on_luyen', newProgress, 1000);
    } catch (error) {
      console.error('Error increasing practice progress:', error);
    }
  },

  /**
   * Tăng tiến trình bài thi thử và check điểm tuyệt đối
   */
  increaseMockTestProgress: async (uid: string, score: number, totalQuestions: number): Promise<void> => {
    try {
      const ref = doc(db, 'users', uid, 'userBadges', 'chinh_phuc_bien_ca');
      const docSnap = await getDoc(ref);
      let current = 0;
      if (docSnap.exists()) {
        current = docSnap.data().currentProgress || 0;
      }
      const newProgress = current + 1;

      // Cập nhật tiến trình số bài thi thử
      await BadgeService.updateBadgeProgress(uid, 'vuot_song', newProgress, 1);
      await BadgeService.updateBadgeProgress(uid, 'chinh_phuc_bien_ca', newProgress, 10);
      
      // Check điểm tuyệt đối
      if (score === totalQuestions && totalQuestions > 0) {
        await BadgeService.unlockBadge(uid, 'diem_tuyet_doi');
      }
    } catch (error) {
      console.error('Error increasing mock test progress:', error);
    }
  },

  /**
   * Đánh dấu các huy hiệu đã xem (xóa trạng thái chấm đỏ isNew)
   */
  markAsRead: async (uid: string, badgeIds: string[]) => {
    if (!badgeIds.length) return;
    try {
      const batch = writeBatch(db);
      badgeIds.forEach(id => {
        const ref = doc(db, 'users', uid, 'userBadges', id);
        batch.update(ref, { isNew: false });
      });
      await batch.commit();
    } catch (error) {
      console.error('Error marking badges as read:', error);
    }
  },

  /**
   * Reset/Xóa toàn bộ huy hiệu của một user khi tái sử dụng tài khoản
   */
  resetUserBadges: async (uid: string) => {
    try {
      const q = query(collection(db, 'users', uid, 'userBadges'));
      const snapshot = await getDocs(q);
      if (snapshot.empty) return;
      const batch = writeBatch(db);
      snapshot.docs.forEach(docSnap => {
        batch.delete(docSnap.ref);
      });
      await batch.commit();
    } catch (error) {
      console.error('Error resetting user badges:', error);
    }
  },

  /**
   * Thu hồi (revoke) một huy hiệu cụ thể — chỉ Admin sử dụng
   * Xóa document badge progress của user, khiến badge trở về trạng thái chưa unlock
   */
  revokeBadge: async (uid: string, badgeId: string): Promise<boolean> => {
    try {
      const badgeRef = doc(db, 'users', uid, 'userBadges', badgeId);
      const badgeDoc = await getDoc(badgeRef);

      if (!badgeDoc.exists() || !badgeDoc.data().isUnlocked) {
        return false; // Badge chưa unlock, không cần thu hồi
      }

      // Xóa hẳn document để reset hoàn toàn
      const { deleteDoc } = await import('firebase/firestore');
      await deleteDoc(badgeRef);
      return true;
    } catch (error) {
      console.error('Error revoking badge:', error);
      return false;
    }
  }
};
