// Đây là file "lính gác" cho trang quan-ly.html

// 1. Cần "ổ cắm điện" (Config) y chang file app.js
const firebaseConfig = {
    apiKey: "AIzaSyDll7h-FpzCVml2vy8KeMPA6xExGUda_NE",
    authDomain: "thi-tnd.firebaseapp.com",
    databaseURL: "https://thi-tnd-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "thi-tnd",
    storageBucket: "thi-tnd.firebasestorage.app",
    messagingSenderId: "107125875663",
    appId: "1:107125875663:web:0e1a632779f51340c828ba",
    measurementId: "G-FSR87KREQ9"
};

// 2. "Cắm điện"
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// 3. KIỂM TRA "VÉ" (Phép thuật chính là đây)
auth.onAuthStateChanged(async (user) => {
    const adminContent = document.getElementById('admin-content');
    const loadingMessage = document.getElementById('loading-message');
    
    if (user) {
        // Cưng đã đăng nhập, giờ check "vé" (role) trong "tủ"
        const docRef = db.collection('users').doc(user.uid);
        const doc = await docRef.get();

        if (doc.exists) {
            const userRole = doc.data().role; // Lấy tên raw
            
            // 💖 QUYỀN LỰC LÀ ĐÂY (Thêm 'lanh_dao' nè) 💖
            if (userRole === 'giao_vien' || userRole === 'admin' || userRole === 'lanh_dao') {
                // "Vé xịn"! Cho vô!
                loadingMessage.style.display = 'none';
                adminContent.style.display = 'block';
                // Hiện luôn link "Quản lý" trên menu cho đẹp
                document.getElementById('quan-ly-link').style.display = 'block';
            } else {
                // "Vé thường" (hoc_vien)! Đuổi về!
                alert('Ui! Cưng không có "vé" (quyền) để vào trang này nha. 😥');
                window.location.href = 'index.html'; // "Đá" về trang chủ
            }
        } else {
            // Lỡ có lỗi gì đó không có hồ sơ
            alert('Lỗi! Không tìm thấy hồ sơ vai trò của cưng.');
            window.location.href = 'index.html';
        }
        
    } else {
        // Cưng CHƯA đăng nhập! "Đá" về trang đăng nhập
        alert('Cưng phải đăng nhập mới vô được nha!');
        window.location.href = 'dang-nhap.html';
    }
});