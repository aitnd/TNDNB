// Script seed 5 quán từ ảnh - chạy 1 lần trong dashboard
// Copy vào console browser tại /amthuc/dashboard sau khi đăng nhập

const restaurants = [
    // 1. Menu Nhà Em (Ship ngày & đêm)
    {
        info: {
            name: 'Menu Nhà Em',
            phone: '0982307002',
            address: 'Không có địa chỉ cụ thể',
            categories: ['Gà', 'Ếch', 'Mì xào', 'Xôi'],
            description: 'Ship ngày & đêm - 0982307002 (ngày) / 0986376661 (đêm)'
        },
        menu: [
            { name: 'Gà hun khói, gà ủ muối', price: 125000, category: 'Gà' },
            { name: 'Chân gà sả tắc, sốt thái', price: 50000, category: 'Gà' },
            { name: 'Gân bò muối rau tiên vua', price: 100000, category: 'Đặc sản' },
            { name: 'Đùi ếch chiên giòn', price: 100000, category: 'Ếch' },
            { name: 'Đùi ếch rang muối', price: 110000, category: 'Ếch' },
            { name: 'Nộm chân gà rút xương', price: 85000, category: 'Gà' },
            { name: 'Nộm tai heo', price: 85000, category: 'Đặc sản' },
            { name: 'Cá trứng chiên giòn', price: 100000, category: 'Cá' },
            { name: 'Chân gà luộc', price: 90000, category: 'Gà' },
            { name: 'Chân gà rang muối', price: 100000, category: 'Gà' },
            { name: 'Cánh gà rang muối', price: 100000, category: 'Gà' },
            { name: 'Gà rang muối', price: 110000, category: 'Gà' },
            { name: 'Dồi sụn', price: 10000, category: 'Đặc sản' },
            { name: 'Xôi chim chiên', price: 60000, category: 'Xôi' },
            { name: 'Óc nhồi ống nứa hấp', price: 80000, category: 'Đặc sản' },
            { name: 'Mì xào bò', price: 40000, category: 'Mì xào' },
            { name: 'Mì xào xúc xích viên chiên', price: 35000, category: 'Mì xào' },
            { name: 'Mì xào Hải sản', price: 40000, category: 'Mì xào' },
            { name: 'Mì xào thập Cẩm', price: 45000, category: 'Mì xào' },
            { name: 'Xôi ruốc, xôi trứng', price: 25000, category: 'Xôi' },
            { name: 'Xôi trắng', price: 20000, category: 'Xôi' },
            { name: 'Xôi lạp xưởng', price: 30000, category: 'Xôi' },
            { name: 'Xôi xúc xích viên chiên', price: 30000, category: 'Xôi' },
            { name: 'Xôi thập cẩm', price: 45000, category: 'Xôi' }
        ]
    },

    // 2. Quán 824 Nguyễn Công Trứ
    {
        info: {
            name: 'Quán 824 Nguyễn Công Trứ',
            phone: '0912912082',
            address: '824 Nguyễn Công Trứ, TP Hoa Lư, Ninh Bình',
            categories: ['Gà', 'Xôi', 'Đặc sản'],
            description: 'Không rõ giờ, có ship buổi chiều'
        },
        menu: [
            { name: 'Gà Luộc', price: 230000, category: 'Gà' },
            { name: 'Gà ủ muối', price: 140000, category: 'Gà' },
            { name: 'Xôi chim chiên', price: 65000, category: 'Xôi' },
            { name: 'Chân Gà Luộc', price: 90000, category: 'Gà' },
            { name: 'Chân gà xả tắc / sốt thái', price: 80000, category: 'Gà' },
            { name: 'Nhông ong xào lá chanh', price: 200000, category: 'Đặc sản' },
            { name: 'Trứng Vịt lộn luộc', price: 80000, category: 'Trứng' },
            { name: 'Dồi sụn chiên', price: 10000, category: 'Đặc sản' },
            { name: 'Lạp xưởng chiên', price: 15000, category: 'Đặc sản' },
            { name: 'Hoa Quả Tổng Hợp', price: 50000, category: 'Đồ uống' }
        ]
    },

    // 3. Ship Đồ Ăn Đêm (Mì Cay, Lẩu Ly)
    {
        info: {
            name: 'Ship Đồ Ăn Đêm (Mì Cay, Lẩu Ly)',
            phone: '0986288397',
            address: 'Không có địa chỉ cụ thể',
            categories: ['Mì cay', 'Lẩu', 'Ăn vặt'],
            description: 'Ship 15:00 - 03:00 sáng - Zalo: 0344851998'
        },
        menu: [
            { name: 'Mì cay (bò, sụn, hải sản)', price: 47500, category: 'Mì cay' },
            { name: 'Mì trộn (trứng ốp, sủi cảo)', price: 35000, category: 'Mì trộn' },
            { name: 'Lẩu ly (bò, sụn, thập cẩm)', price: 40000, category: 'Lẩu' },
            { name: 'Viên chiên', price: 25000, category: 'Ăn vặt' },
            { name: 'Sủi cảo', price: 25000, category: 'Ăn vặt' },
            { name: 'Gà xiên que', price: 25000, category: 'Ăn vặt' },
            { name: 'Xúc xích', price: 25000, category: 'Ăn vặt' },
            { name: 'Lạp xưởng', price: 25000, category: 'Ăn vặt' },
            { name: 'Nem chua rán', price: 25000, category: 'Ăn vặt' }
        ]
    },

    // 4. Quán Ăn Vặt Trần Phú
    {
        info: {
            name: 'Quán Ăn Vặt Trần Phú',
            phone: '0356943456',
            address: 'Số 04 Ngõ 65 Trần Phú (gần Chợ Bóp)',
            categories: ['Nem nướng', 'Bún', 'Mỳ', 'Tokboki', 'Kimbap'],
            description: 'Giờ không rõ'
        },
        menu: [
            { name: 'Nem nướng Nha Trang', price: 35000, category: 'Nem nướng' },
            { name: 'Bún Trộn Nem Nướng', price: 35000, category: 'Bún' },
            { name: 'Bún trộn Bò', price: 39000, category: 'Bún' },
            { name: 'Mỳ trộn', price: 40000, category: 'Mỳ' },
            { name: 'Gà Ủ Muối', price: 149000, category: 'Gà' },
            { name: 'Chân gà sốt thái', price: 50000, category: 'Gà' },
            { name: 'Cơm gà', price: 49000, category: 'Cơm' },
            { name: 'Cơm trộn Hàn Quốc', price: 39000, category: 'Cơm' },
            { name: 'Mỳ Ý', price: 35000, category: 'Mỳ' },
            { name: 'Mỳ cay kim chi (có viên, xúc xích, bò, hải sản)', price: 47000, category: 'Mỳ cay' },
            { name: 'Tokbokki (Gốc phô mai, sốt truyền thống)', price: 37500, category: 'Tokboki' },
            { name: 'Pizza chicago', price: 50000, category: 'Pizza' },
            { name: 'Kimbap (Chiên, Thường, Bò)', price: 35000, category: 'Kimbap' },
            { name: 'Đồ chiên (Nem chua, xúc xích, khoai tây, khoai lang)', price: 30000, category: 'Ăn vặt' }
        ]
    },

    // 5. Quán Ăn Đêm Xuân Thành
    {
        info: {
            name: 'Quán Ăn Đêm Xuân Thành',
            phone: '0368730876',
            address: '516 đường Xuân Thành, TP. Ninh Bình',
            categories: ['Gà', 'Nướng', 'Đặc sản'],
            description: 'Mở 17:00 - Sáng - SĐT: 0342299012'
        },
        menu: [
            { name: 'Chân gà nướng', price: 12000, category: 'Gà' },
            { name: 'Chân gà luộc', price: 12000, category: 'Gà' },
            { name: 'Hàu nướng', price: 6000, category: 'Hải sản' },
            { name: 'Trứng vịt lộn', price: 8000, category: 'Trứng' },
            { name: 'Trứng gà', price: 6000, category: 'Trứng' },
            { name: 'Xiên nướng', price: 12000, category: 'Nướng' },
            { name: 'Mỳ tôm xào (trứng, xúc xích)', price: 35000, category: 'Mì xào' },
            { name: 'Cơm rang (trứng, xúc xích, thập cẩm)', price: 42500, category: 'Cơm' },
            { name: 'Tiết canh', price: 40000, category: 'Đặc sản' }
        ]
    }
];

// Hướng dẫn: Vào Dashboard, mở Console (F12), paste code này và nhấn Enter
console.log('📋 Data 5 quán đã sẵn sàng!');
console.log('Tổng:', restaurants.length, 'quán,', restaurants.reduce((sum, r) => sum + r.menu.length, 0), 'món');
restaurants.forEach((r, i) => {
    console.log(`${i + 1}. ${r.info.name} - ${r.menu.length} món`);
});
