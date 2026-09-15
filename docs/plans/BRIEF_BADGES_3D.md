# 💡 BRIEF: Nâng cấp Hệ thống 22 Huy hiệu & Hiệu ứng 3D / Framer Motion (Gamification)

**Dự án:** TNDNB — Đào tạo Thuyền viên Ninh Bình  
**Ngày tạo:** 2026-06-29  
**Trạng thái:** 💡 Đang thảo luận (Brainstorming)

---

## 1. Vấn đề & Mục tiêu nâng cấp

### Hiện trạng:
*   Mới triển khai **11/22 huy hiệu thành tích** (bản MVP) và **5 huy hiệu Role** tĩnh (Admin, Lãnh Đạo, Quản Lý, Giáo Viên, Học Viên) dạng 2D phẳng, thiếu tương tác chuyển động.
*   Chưa có huy hiệu Role xuất hiện cạnh tên học viên trên Profile cá nhân (`/ontap/profile`) và các vị trí bảng xếp hạng.
*   Hiệu ứng mở khóa huy hiệu còn đơn giản, chưa tạo được cảm giác "Wow" và mong muốn chinh phục (Duolingo Effect) cho học viên.

### Mục tiêu:
1.  **Hoàn thiện danh sách 22 Huy hiệu Thành tích** theo nghiên cứu gốc.
2.  **Tích hợp hiệu ứng 3D động** (CSS 3D Transforms / Lottie / Framer Motion) giúp huy hiệu "sống động" (lơ lửng, phản ứng khi di chuột, lấp lánh khi mở khóa).
3.  **Tích hợp Role Badge cạnh tên hiển thị** trên Profile, Bảng xếp hạng và Phòng thi trực tuyến.

---

## 2. Danh sách 22 Huy hiệu Thành tích & 5 Huy hiệu Role

### 🎓 Nhóm 1: Ôn Tập & Học Tập (6 huy hiệu)
*   **Tân Binh Trên Bờ (Đồng):** Hoàn thành bài ôn tập đầu tiên.
*   **Thủy Thủ Chăm Chỉ (Bạc):** Hoàn thành 50 câu ôn tập.
*   **Hoa Tiêu Kiến Thức (Vàng):** Hoàn thành 200 câu ôn tập.
*   **Bách Khoa Hàng Hải (Kim cương):** Hoàn thành ôn tập ở tất cả các môn học.
*   **Người Không Ngại Sai (Bạc):** Làm lại 10 câu trả lời sai và trả lời đúng.
*   **Bậc Thầy Ôn Luyện (Kim cương):** Hoàn thành 1000 câu ôn tập (tích lũy).

### 🏆 Nhóm 2: Thi Thử & Thành Tích (5 huy hiệu)
*   **Lần Đầu Ra Khơi (Đồng):** Hoàn thành bài thi thử đầu tiên.
*   **Vượt Sóng Thành Công (Bạc):** Đạt điểm ≥ 70% trong 1 bài thi thử.
*   **Thuyền Trưởng Xuất Sắc (Vàng):** Đạt điểm ≥ 90% trong 1 bài thi thử.
*   **Điểm Tuyệt Đối (Kim cương):** Đạt 100% điểm trong 1 bài thi thử.
*   **Chinh Phục Biển Cả (Vàng):** Hoàn thành 10 bài thi thử.

### 🔥 Nhóm 3: Streak & Kiên Trì (4 huy hiệu)
*   **Ngọn Lửa Nhỏ (Đồng):** Học 3 ngày liên tiếp.
*   **Ngọn Hải Đăng (Bạc):** Học 7 ngày liên tiếp.
*   **Thép Đã Tôi (Vàng):** Học 30 ngày liên tiếp.
*   **Huyền Thoại Không Nghỉ (Kim cương):** Học 100 ngày liên tiếp.

### 👥 Nhóm 4: Cộng Đồng & Tương Tác (4 huy hiệu)
*   **Người Bạn Đồng Hành (Đồng):** Tham gia lớp học đầu tiên.
*   **Ngôi Sao Lớp Học (Vàng):** Đứng Top 3 bảng xếp hạng lớp.
*   **Chiến Binh Phòng Thi (Bạc):** Tham gia 5 phòng thi trực tuyến.
*   **Vô Địch Phòng Thi (Vàng):** Đạt hạng 1 trong 1 phòng thi trực tuyến.

### 🎪 Nhóm 5: Đặc Biệt & Ẩn (3 huy hiệu)
*   **Cú Đêm Hải Phòng (Bạc):** Hoàn thành 1 bài ôn tập/thi lúc 0h-5h sáng.
*   **Người Tiên Phong (Vàng):** Là 1 trong 50 người đầu tiên nhận huy hiệu trên hệ thống.
*   **Nhà Sưu Tập (Kim cương):** Mở khóa tất cả huy hiệu nhóm 1, 2, 3 (15 huy hiệu).

### 👑 Nhóm 6: Huy hiệu Role (Hiển thị cạnh tên)
*   **Admin 👑 (Đặc biệt):** Có quyền xem và cấp/thu hồi huy hiệu của học viên.
*   **Lãnh Đạo 🦅**
*   **Quản Lý 🛡️**
*   **Giáo Viên 👨‍🏫**
*   **Học Viên ⚓**

---

## 3. Ý tưởng hiệu ứng Visuals & Motion (Premium UX)

### A. Hiệu ứng Hover 3D Card (Tilt & Depth Effect)
*   Khi di chuột hoặc chạm tay vào huy hiệu (bất kể Locked hay Unlocked), huy hiệu sẽ nghiêng theo chiều chuyển động của con trỏ (3D Card Tilt) tạo cảm giác có chiều sâu vật lý.
*   Sử dụng: Framer Motion `useMotionValue`, `useTransform` kết hợp CSS `transform: perspective(1000px) rotateX(...) rotateY(...)`.

### B. Trạng thái "Sống động" (Active State)
*   Huy hiệu đã mở khóa sẽ có hiệu ứng **nhấp nhô nhẹ nhàng (Floating/Bobbing)** liên tục ở trục Y.
*   Có vệt sáng quét qua bề mặt (shimmer effect) mỗi 3-5 giây để thu hút sự chú ý.
*   Đường viền bao quanh (Border) phát sáng nhẹ (Soft Glow) tương ứng với màu cấp độ (Đồng ➔ Bạc ➔ Vàng ➔ Kim cương).

### C. Portal chúc mừng mở khóa (Unlock Celebration)
*   Khi học viên nộp bài đạt điều kiện mở khóa ➔ Hiển thị màn hình Popup phủ đen (Modal backdrop).
*   Hiệu ứng pháo hoa giấy rơi (Confetti) rực rỡ bao phủ màn hình.
*   Huy hiệu xoay vòng 3D nhanh từ tâm màn hình phóng to ra ngoài kèm theo vệt sáng tỏa tròn phía sau (radial shine rays rotating).

### D. Role Badge cạnh tên
*   Mini-badge hiển thị dạng Lottie động hoặc SVG phát sáng nhẹ (kích thước nhỏ `16px` đến `24px`) ngay bên cạnh tên học viên ở:
    *   Trang Profile cá nhân (`/ontap/profile`).
    *   Thanh Header / Navigation bar cạnh avatar.
    *   Bảng xếp hạng lớp (`StudentsTab`).
    *   Phòng thi trực tuyến.

---

## 4. Nghiên cứu Thư viện & Giải pháp Công nghệ nổi tiếng trên GitHub

Qua nghiên cứu xu hướng UX/UI Gamification trên GitHub và các cộng đồng thiết kế hàng đầu, có 3 hướng giải pháp công nghệ tối ưu nhất để xây dựng hệ thống Huy hiệu 3D:

### A. Mô phỏng Pokémon Holographic Card CSS (simeydotme/pokemon-cards-css - 8k+ Stars)
*   **Chi tiết:** Đây là dự án kinh điển mô phỏng hoàn hảo hiệu ứng lá bài 3D óng ánh (Holographic Foil Card) bằng **CSS thuần (Gradients, Mix-blend-modes, Filters)** kết hợp với việc cập nhật tọa độ chuột.
*   **Ứng dụng vào TNDNB:** Chúng ta có thể chuyển thể giải pháp này sang React component bằng cách dùng Framer Motion theo dõi cursor chuột để thay đổi các biến CSS `--x`, `--y` và góc quay 3D. Hiệu ứng phản quang ánh kim và chuyển sắc vồng (rainbow glare) sẽ tự động trượt theo hướng chuột nghiêng mà không cần load thư viện nặng.

### B. Hiệu ứng Parallax 3D Card Tilt (react-parallax-tilt - 2.5k+ Stars)
*   **Chi tiết:** Thư viện này cực kỳ nhẹ và chuyên dụng cho hiệu ứng nghiêng 3D của thẻ bài khi di chuột, tự động tính toán góc nghiêng vật lý và tạo lớp phủ phản quang (glare).
*   **Ứng dụng vào TNDNB:** Thay vì cài thêm thư viện npm mới làm phình to bundle size, chúng ta có thể **tự code trực tiếp (custom implementation) trong dự án** bằng cách kết hợp:
    - `useMotionValue` của Framer Motion để lấy tọa độ chuột.
    - `useSpring` để tạo độ trễ đàn hồi mượt mà như thật (card có cảm giác nặng khi di chuột).
    - `useTransform` để đổi góc `rotateX`, `rotateY` và vị trí ánh sáng phản chiếu.

### C. Hiệu ứng Pháo hoa ăn mừng (Unlock Confetti - 12k+ Stars)
*   **Chi tiết:** Thư viện `canvas-confetti` là tiêu chuẩn của các hệ thống gamification khi mở khóa phần thưởng.
*   **Ứng dụng vào TNDNB:** Để tránh xung đột phiên bản với React 19 mới nhất của dự án, chúng ta sẽ tự xây dựng một **Confetti Canvas Component** siêu nhẹ chạy bằng `requestAnimationFrame`. Canvas này sẽ tự giải phóng bộ nhớ khi tắt popup chúc mừng, đảm bảo tối ưu hiệu năng cao nhất trên cả thiết bị di động yếu (qua Capacitor WebView).

---

## 5. Phân tích Tránh Chồng Chéo & Lỗi Xung Đột (Code Audit)

Để đảm bảo đợt nâng cấp này không gây xung đột với mã nguồn cũ và vận hành đồng bộ trên cả Web App và Windows App, chúng ta cần xử lý các điểm chồng chéo sau:

### A. Đồng bộ hóa ID Huy hiệu (Achievement ID Mismatch)
*   **Vấn đề:** Hiện tại trong code xử lý thi trực tuyến (`ThiTrucTuyenPage.tsx` trên Web) và hoàn thành thi thử (`App.tsx` trên Windows) đang gọi mở khóa ID: `achievement_1` và `achievement_perfect`. Tuy nhiên, trong danh sách `BADGE_DEFINITIONS` (`badges.ts`) hai ID này không tồn tại, dẫn đến popup mở khóa trả về `null` (không hiển thị được).
*   **Giải pháp:** Ánh xạ lại chính xác:
    - Thay `achievement_1` thành `lan_dau_ra_khoi` (Lần Đầu Ra Khơi).
    - Thay `achievement_perfect` thành `diem_tuyet_doi` (Điểm Tuyệt Đối).

### B. Thiếu trigger cập nhật tiến trình học tập (Practice Progress)
*   **Vấn đề:** Mặc dù `badgeService.ts` đã viết sẵn hàm `updateBadgeProgress`, nhưng hiện tại trong các màn hình làm bài ôn tập/thi thử (`QuizScreen.tsx`, `App.tsx` Web) không hề có dòng code nào gọi hàm này khi người dùng trả lời câu hỏi. Trạng thái các huy hiệu ôn tập (`thuy_thu_cham_chi`, `hoa_tieu_kien_thuc`, `bac_thay_on_luyen`) luôn ở mức 0% và bị khóa.
*   **Giải pháp:** Thêm trigger gọi `BadgeService.updateBadgeProgress` ngay sau khi học viên bấm kết thúc bài ôn tập/thi thử dựa trên số lượng câu hỏi tích lũy từ kết quả lưu trong Firestore.

### C. Thiếu Role Badge trong Profile cá nhân
*   **Vấn đề:** Component `MiniRoleBadge.tsx` đã được viết nhưng chỉ đang hiển thị ở bảng xếp hạng học viên (`StudentCard.tsx`) và thanh điều hướng (`TopNavbar.tsx`). Trong trang cá nhân của học viên (`AccountScreen.tsx` cả bản Web và Win) dòng hiển thị tên không gọi component này, dẫn đến không hiện role admin cạnh tên như anh phản ánh.
*   **Giải pháp:** Tích hợp `<MiniRoleBadge role={userProfile.role} />` trực tiếp cạnh phần hiển thị tên học viên trên `AccountScreen.tsx` (cả bản Web và Win).

---

## 6. Câu hỏi thảo luận & Lựa chọn

1.  **Về dung lượng tải trang:** Chúng ta nên sử dụng **SVG Layered + Framer Motion (CSS 3D)** (app tải siêu nhanh, nhẹ) hay dùng **Lottie JSON** (đẹp nhưng tốn dung lượng tải tệp)?
2.  **Về giao diện Bộ sưu tập:** Anh muốn chia 22 huy hiệu thành 5 nhóm tab riêng biệt hay hiển thị chung dạng Grid nhưng phân nhóm bằng tiêu đề?
3.  **Về quyền Admin:** Có cần thêm bảng điều khiển trong trang quản lý lớp để Admin click cấp trực tiếp hoặc thu hồi huy hiệu của học viên không?

