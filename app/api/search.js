module.exports = (req, res) => {
    const { q } = req.query;

    // 💖 THÊM: Nếu q='all' thì trả về hết (để script.js tải về lọc)
    if (q === 'all') {
         // (Đảm bảo cachedData đã được load)
         if (!cachedData) { /* ...code load file... */ }
         
         // Trả về bản rút gọn để nhẹ bớt (chỉ cần tên tỉnh, tên xã cũ/mới)
         const simpleData = cachedData.map(item => ({
             province_name: item.province_name,
             ward_name: item.ward_name,
             old_units: item.old_units,
             merger_details: item.merger_details
         }));
         return res.status(200).json(simpleData);
    }

    // ... (Phần logic tìm kiếm cũ giữ nguyên)
    return res.status(200).json([]);
};