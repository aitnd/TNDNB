const admin = require('firebase-admin');
const fs = require('fs');
const csv = require('csv-parser');

// 1. Cấu hình Firebase
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

// Hàm chuẩn hóa ID (Phải giống hệt Step 1)
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
    str = str.replace(/[^a-z0-9]/g, "_");
    return str;
}

async function updateMergerData() {
    console.log("⏳ Đang đọc file 'sap nhap.xlsx - DATA.csv'...");
    
    // Để tra cứu nhanh, ta cần load dữ liệu gốc vào Map
    // Map: "tinh_xa" -> { docId, huyen }
    console.log("⏳ Đang tải dữ liệu gốc từ Firebase...");
    const snapshot = await db.collection('don_vi_hanh_chinh').get();
    const dbMap = new Map();
    
    snapshot.forEach(doc => {
        const d = doc.data();
        // Key tìm kiếm: tinh_xa (không dấu)
        const key = `${toNonAccentVietnamese(d.tinh_cu)}_${toNonAccentVietnamese(d.xa_cu)}`;
        dbMap.set(key, { id: doc.id, huyen: d.huyen_cu });
    });
    console.log(`✅ Đã tải ${dbMap.size} bản ghi gốc.`);

    const batchSize = 400;
    let batch = db.batch();
    let count = 0;
    let updatedCount = 0;

    const mergerStream = fs.createReadStream('sap nhap.xlsx - DATA.csv').pipe(csv());

    for await (const row of mergerStream) {
        const tinh_moi = (row['Tỉnh mới'] || '').trim();
        const xa_moi = (row['Phường/xã mới'] || '').trim();
        const ds_xa_cu_str = (row['Sát nhập từ các Phường/xã trước'] || '').trim();
        const gop_tu_tinh = (row['Gộp từ các tỉnh cũ'] || '').trim(); // Cột các tỉnh cũ

        if (!ds_xa_cu_str) continue;

        // Tách danh sách xã cũ
        const list_xa_cu = ds_xa_cu_str.split(/[,\n]/).map(s => s.trim()).filter(s => s);

        // Mảng các tỉnh cũ có thể có
        const list_tinh_cu_potential = gop_tu_tinh.split(',').map(s => s.trim()).filter(s => s);
        if (list_tinh_cu_potential.length === 0) list_tinh_cu_potential.push(tinh_moi); // Mặc định là tỉnh mới

        // Duyệt qua từng xã cũ để tìm trong DB và update
        for (const ten_xa_cu of list_xa_cu) {
            let foundDoc = null;

            // Thử tìm xã cũ này trong các tỉnh cũ tương ứng
            for (const ten_tinh_cu of list_tinh_cu_potential) {
                const searchKey = `${toNonAccentVietnamese(ten_tinh_cu)}_${toNonAccentVietnamese(ten_xa_cu)}`;
                if (dbMap.has(searchKey)) {
                    foundDoc = dbMap.get(searchKey);
                    break; // Tìm thấy rồi thì thôi
                }
            }

            if (foundDoc) {
                // Tìm thấy! Cập nhật bản ghi đó
                const ref = db.collection('don_vi_hanh_chinh').doc(foundDoc.id);
                
                // Update: Chỉ sửa thông tin MỚI, giữ nguyên thông tin CŨ
                batch.update(ref, {
                    tinh_moi: tinh_moi,
                    xa_moi: xa_moi,
                    sap_nhap: true,
                    chi_tiet: `Sáp nhập từ: ${ds_xa_cu_str}`,
                    // Cập nhật search_text để tìm được bằng tên mới
                    tim_kiem: `${tinh_moi} ${foundDoc.huyen} ${ten_xa_cu} ${xa_moi}`.toLowerCase()
                });

                updatedCount++;
                count++;
            } else {
                console.log(`⚠️ Không tìm thấy xã cũ: ${ten_xa_cu} (trong các tỉnh: ${list_tinh_cu_potential.join(', ')})`);
                // Nếu không tìm thấy trong DB gốc, có thể tạo mới nếu cần (nhưng ở đây ta bỏ qua để đảm bảo dữ liệu sạch)
            }
        }

        if (count >= batchSize) {
            await batch.commit();
            console.log(`Đã cập nhật ${updatedCount} bản ghi...`);
            batch = db.batch();
            count = 0;
        }
    }

    if (count > 0) await batch.commit();
    console.log(`🎉 HOÀN TẤT BƯỚC 2! Đã cập nhật ${updatedCount} xã có thay đổi.`);
}

updateMergerData().catch(console.error);