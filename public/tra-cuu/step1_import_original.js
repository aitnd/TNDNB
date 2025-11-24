const admin = require('firebase-admin');
const fs = require('fs');
const csv = require('csv-parser');

// 1. Cấu hình Firebase
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

// Hàm xóa dấu tiếng Việt để tạo ID duy nhất
function toNonAccentVietnamese(str) {
    if (!str) return "";
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/[^a-z0-9]/g, "_"); // Thay ký tự lạ bằng _
    return str;
}

async function importOriginalData() {
    console.log("⏳ Đang đọc file 'tinh huyen cu.xlsx - Sheet1.csv'...");
    
    const batchSize = 400;
    let batch = db.batch();
    let count = 0;
    let total = 0;

    const stream = fs.createReadStream('tinh huyen cu.xlsx - Sheet1.csv')
        .pipe(csv());

    for await (const row of stream) {
        // 💖 ĐỌC ĐÚNG TÊN CỘT TỪ FILE MỚI CỦA ANH 💖
        const tinh = (row['Tỉnh Thành Phố'] || '').trim();
        const huyen = (row['Quận Huyện'] || '').trim();
        const xa = (row['Phường Xã'] || '').trim();

        if (!tinh || !huyen || !xa) continue;

        // Tạo ID duy nhất: tinh_huyen_xa (để sau này dễ tìm cập nhật)
        const docId = `${toNonAccentVietnamese(tinh)}_${toNonAccentVietnamese(huyen)}_${toNonAccentVietnamese(xa)}`;
        const ref = db.collection('don_vi_hanh_chinh').doc(docId);
        
        const docData = {
            // Dữ liệu Cũ (Gốc) - QUAN TRỌNG
            tinh_cu: tinh,
            huyen_cu: huyen,
            xa_cu: xa,
            
            // Mặc định ban đầu (chưa sáp nhập)
            tinh_moi: tinh,
            xa_moi: xa,
            
            // Thông tin khác
            ds_xa_cu: [`${xa} (${huyen} - ${tinh})`], // Để hiển thị đẹp
            sap_nhap: false,
            chi_tiet: "Dữ liệu gốc 2024",
            
            // Search text (để tìm kiếm không dấu)
            tim_kiem: [tinh, huyen, xa].join(' ').toLowerCase()
        };

        batch.set(ref, docData);
        count++;
        total++;

        if (count >= batchSize) {
            await batch.commit();
            console.log(`Đã nạp ${total} dòng...`);
            batch = db.batch();
            count = 0;
        }
    }

    if (count > 0) await batch.commit();
    console.log(`🎉 HOÀN TẤT BƯỚC 1! Đã nạp ${total} đơn vị hành chính (đầy đủ Huyện Cũ).`);
}

importOriginalData().catch(console.error);