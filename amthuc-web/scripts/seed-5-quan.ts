// Script seed quán mới - chạy trong console browser tại /amthuc/dashboard
// Copy vào console (F12) và nhấn Enter để seed

// Thêm quán mới vào đây - format:
// { info: { name, phone, address, categories, description }, menu: [{ name, price, category }] }
const restaurants: Array<{
    info: { name: string; phone: string; address: string; categories: string[]; description: string };
    menu: Array<{ name: string; price: number; category: string }>;
}> = [
        // Thêm quán mới ở đây
    ];

// Hướng dẫn: Vào Dashboard, mở Console (F12), paste code này và nhấn Enter
console.log('📋 Data quán đã sẵn sàng!');
console.log('Tổng:', restaurants.length, 'quán,', restaurants.reduce((sum, r) => sum + r.menu.length, 0), 'món');
restaurants.forEach((r, i) => {
    console.log(`${i + 1}. ${r.info.name} - ${r.menu.length} món`);
});
