const { initializeApp } = require('firebase/app');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');
const { getFirestore, collection, doc, deleteDoc, getDocs, setDoc } = require('firebase/firestore');
require('dotenv').config();

// Firebase config
const firebaseConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY || "AIzaSyDll7h-FpzCVml2vy8KeMPA6xExGUda_NE",
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || "thi-tnd.firebaseapp.com",
    projectId: process.env.VITE_FIREBASE_PROJECT_ID || "thi-tnd",
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || "thi-tnd.firebasestorage.app",
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "107125875663",
    appId: process.env.VITE_FIREBASE_APP_ID || "1:107125875663:web:0e1a632779f51340c828ba",
    databaseURL: process.env.VITE_FIREBASE_DATABASE_URL || "https://thi-tnd-default-rtdb.asia-southeast1.firebasedatabase.app"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function seedUserBadges(email, password, targetUid, action = 'reset') {
    try {
        console.log(`🔑 Attempting authentication for admin: ${email}...`);
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log(`✅ Logged in as: ${userCredential.user.uid}`);

        const badgesRef = collection(db, 'users', targetUid, 'userBadges');

        if (action === 'reset') {
            console.log(`🗑️ Resetting (deleting) all badges for user ${targetUid}...`);
            const snapshot = await getDocs(badgesRef);
            for (const docSnap of snapshot.docs) {
                await deleteDoc(doc(db, 'users', targetUid, 'userBadges', docSnap.id));
                console.log(`   Deleted badge: ${docSnap.id}`);
            }
            console.log(`🎉 Reset complete for user ${targetUid}!`);
        } else if (action === 'unlock_all') {
            console.log(`🔓 Unlocking all badges for user ${targetUid}...`);
            const mockBadges = [
                'tan_binh_tren_bo', 'thuy_thu_cham_chi', 'hoa_tieu_kien_thuc', 'bach_khoa_hang_hai',
                'nguoi_khong_ngai_sai', 'bac_thay_on_luyen', 'lan_dau_ra_khoi', 'vuot_song_thanh_cong',
                'thuyen_truong_xuat_sac', 'diem_tuyet_doi', 'chinh_phuc_bien_ca', 'ngon_lua_nho',
                'ngon_hai_dang', 'thep_da_toi', 'huyen_thoai_khong_nghi', 'nguoi_ban_dong_hanh',
                'ngoi_sao_lop_hoc', 'chien_binh_phong_thi', 'vo_dich_phong_thi', 'cu_dem_hai_phong',
                'nguoi_tien_phong', 'nha_suu_tap'
            ];

            for (const badgeId of mockBadges) {
                await setDoc(doc(db, 'users', targetUid, 'userBadges', badgeId), {
                    isUnlocked: true,
                    isNew: true,
                    unlockedAt: new Date(),
                    currentProgress: 100
                });
                console.log(`   Unlocked badge: ${badgeId}`);
            }
            console.log(`🎉 Unlocked all badges for user ${targetUid}!`);
        }
    } catch (error) {
        console.error("❌ Error in seed script:", error);
    }
}

// Lấy tham số từ dòng lệnh
const args = process.argv.slice(2);
if (args.length < 3) {
    console.log("Usage: node seedBadges.js <admin_email> <admin_password> <target_uid> [reset|unlock_all]");
    process.exit(1);
}

const [email, password, targetUid, action] = args;
seedUserBadges(email, password, targetUid, action || 'reset');
