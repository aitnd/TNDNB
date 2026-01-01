# 🍜 Implementation Plan - Web App "Đói Ăn Gì?"

## Mô tả
Web app tổng hợp menu các quán ăn, giúp người dùng dễ dàng tìm kiếm món ăn và biết nơi để ăn/đặt về.

---

## 🎨 Thiết kế phong cách Gen Z

### Màu sắc chủ đạo
- **Primary**: Gradient hồng-cam-vàng (sunset vibes)
- **Background**: Tối với glassmorphism
- **Accent**: Neon (xanh mint, tím)

### Hiệu ứng
- Glassmorphism (backdrop blur)
- Gradient borders
- Micro-animations (hover, scroll)
- Emoji & stickers

### Typography
- Font: Space Grotesk / Outfit (hiện đại, đậm)
- Rounded corners everywhere

---

## 📁 Cấu trúc thư mục

```
e:/amthuc/
├── index.html
├── package.json
├── vite.config.ts
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css              # Design system
│   ├── firebase.ts            # Firebase config
│   ├── types/
│   │   └── index.ts           # TypeScript interfaces
│   ├── components/
│   │   ├── Layout/
│   │   ├── Home/
│   │   ├── Restaurant/
│   │   └── Admin/
│   ├── pages/
│   ├── hooks/
│   └── utils/
└── public/
```

---

## 🔧 Tech Stack

| Công nghệ | Mục đích |
|-----------|----------|
| Vite | Build tool nhanh |
| React 18 | UI Framework |
| TypeScript | Type safety |
| Firebase Firestore | Database |
| Firebase Auth | Xác thực admin |
| React Router | Routing |
| Framer Motion | Animations |
| Lucide React | Icons |

---

## 📊 Firebase Data Structure

### Collection: `restaurants`
```json
{
  "id": "auto-generated",
  "name": "Quán Chợ Bóp",
  "address": "sn 04 Ngõ 65 Trần Phú",
  "phone": "0356943456",
  "categories": ["Đồ ăn vặt", "Gà", "Mỳ cay"],
  "createdAt": "timestamp"
}
```

### Collection: `menuItems`
```json
{
  "id": "auto-generated",
  "restaurantId": "restaurant-id",
  "name": "Nem nướng Nha Trang",
  "price": 35000,
  "category": "Nem nướng",
  "isPopular": true
}
```

---

## 🎯 Tính năng chính

### Người dùng
1. Xem danh sách quán ăn
2. Tìm kiếm món ăn → hiển thị quán nào có
3. Lọc theo loại món, khoảng giá
4. Xem chi tiết quán + menu đầy đủ
5. Gọi điện/xem địa chỉ

### Admin Dashboard
1. Đăng nhập bằng email/password
2. Thêm/sửa/xóa quán ăn
3. Quản lý menu từng quán
4. Upload hình ảnh

---

## ⏱️ Thời gian ước tính

| Chặng | Công việc | Thời gian |
|-------|-----------|-----------|
| 1 | Setup dự án + Design system | 1 buổi |
| 2 | Giao diện người dùng | 1-2 buổi |
| 3 | Dashboard Admin | 1-2 buổi |
| 4 | Hoàn thiện + Deploy | 0.5 buổi |

**Tổng: ~4-5 buổi**

---

## ✅ Kiểm thử

### Build check
```bash
npm run build
npx tsc --noEmit
```

### Manual check
- [ ] Trang chủ hiển thị đẹp
- [ ] Tìm kiếm hoạt động
- [ ] Responsive trên mobile
- [ ] Admin đăng nhập được
- [ ] CRUD quán ăn hoạt động
- [ ] CRUD menu hoạt động
