# Phase 03: 3D Card Tilt, Holographic & Confetti Components
Status: ⬜ Pending
Dependencies: Phase 02

## Objective
Xây dựng bộ thư viện UI chuyên dụng cho Huy hiệu 3D động cực kỳ đẹp mắt, bao gồm hiệu ứng nghiêng Parallax Tilt bằng chuột, phản quang óng ánh, và Canvas Confetti bắn pháo hoa khi mở khóa.

## Implementation Steps
1. [ ] **Tạo component `BadgeIcon3D.tsx`:**
   Sử dụng Framer Motion:
   - Theo dõi sự kiện di chuột `onMouseMove` để tính toán tọa độ tương đối.
   - Dùng `useMotionValue` lưu trữ tọa độ X, Y chuẩn hóa `[-0.5, 0.5]`.
   - Dùng `useSpring` tạo chuyển động xoay vật lý đàn hồi mượt mà cho trục X và Y.
   - Thêm phần tử `div` con tuyệt đối làm lớp kính phản quang (Glare/Shimmer) và dải sắc cầu vồng (Holographic Foil), dịch chuyển ngược hướng di chuột bằng `useTransform`.
2. [ ] **Xây dựng `ConfettiCanvas.tsx`:**
   - Sử dụng phần tử `<canvas>` phủ toàn màn hình với `z-index: 9999` (pointer-events-none).
   - Viết hiệu ứng sinh hạt giấy màu sắc rơi tự do, lắc lư hình sin, chịu lực cản không khí và trọng lực.
   - Sử dụng vòng lặp `requestAnimationFrame` tối ưu hiệu năng. Tự động dọn dẹp biến và ngắt vòng lặp khi tắt component để tránh tràn bộ nhớ (Memory Leak).
3. [ ] **Cập nhật màn hình chúc mừng mở khóa `BadgeUnlockPopup.tsx`:**
   - Tích hợp `<ConfettiCanvas>` ngay khi popup hiển thị.
   - Thêm hiệu ứng tia sáng tỏa tròn xoay vòng chậm ở nền sau Huy hiệu (radial sunburst rays rotating).
   - Cho Huy hiệu 3D bay phóng to từ tâm màn hình kèm độ trễ spring nảy cực đẹp.
4. [ ] **Nâng cấp `MiniRoleBadge.tsx`:**
   - Bổ sung hiệu ứng lấp lánh (sparkle twinkle) hoặc viền vàng phát sáng neon nhẹ chạy quanh icon Admin/Role giúp phân biệt rõ ràng đẳng cấp.

## Files to Create/Modify
- `d:/Antigravity/TNDNB/ontap-web/components/Badges/BadgeIcon3D.tsx` - [NEW] Component 3D Tilt Glare Card
- `d:/Antigravity/TNDNB/ontap-web/components/Badges/ConfettiCanvas.tsx` - [NEW] Pháo hoa giấy Canvas thuần siêu nhẹ
- `d:/Antigravity/TNDNB/ontap-web/components/Badges/BadgeUnlockPopup.tsx` - [MODIFY] Thêm pháo hoa, tia sáng nền xoay vòng
- `d:/Antigravity/TNDNB/ontap-web/components/Badges/MiniRoleBadge.tsx` - [MODIFY] Nâng cấp hiệu ứng lấp lánh cho Role
- Đồng bộ các file trên sang thư mục `ontap-win/components/Badges/`.

## Test Criteria
- Rà soát giao diện component 3D trên Storybook/App chạy thử. Rê chuột vào huy hiệu xem góc quay 3D nghiêng và dải phản quang lướt theo có mượt mà 60fps không.
- Test đóng/mở popup unlock nhiều lần để kiểm tra lượng RAM tiêu thụ của Canvas Confetti xem có bị rò rỉ bộ nhớ không.
