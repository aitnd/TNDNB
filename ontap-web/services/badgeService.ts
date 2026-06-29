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
    try {
      const badgeRef = doc(db, 'users', uid, 'userBadges', badgeId);
      const badgeDoc = await getDoc(badgeRef);
      
      const isUnlockingNow = progress >= targetValue;

      if (badgeDoc.exists()) {
         const data = badgeDoc.data();
         if (data.isUnlocked) return false; // Đã unlock từ trước

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
  }
};
