# 🚀 HƯỚNG DẪN CƠ BẢN (QUICK START V5.0)

Hướng dẫn nhanh cách cài đặt và chạy Sora Tool V5.0.

---

## 🏗️ 1. CẤU HÌNH (Làm 1 lần đầu)

Trước khi chạy tool, bạn cần kiểm tra 2 file sau trong thư mục tool:

### **A. Đường dẫn Chrome (`chrome_path.txt`)**
Mở file `chrome_path.txt` và dán đường dẫn đến file `chrome.exe` của bạn vào đó:
```text
C:\Program Files\Google\Chrome\Application\chrome.exe
```
*(Nếu bạn để trống, Tool sẽ tự động tìm. Nhưng tốt nhất hãy copy đường dẫn chính xác vào file này).*

### **B. Nhập Proxy (`proxies.txt`)**
Nếu bạn định dùng Proxy, hãy điền sẵn list vào file `proxies.txt` trước:
```text
ip:port:user:pass
...
```

---

## 🏃 2. CHẠY TOOL
*   Nhấn đúp vào file **`SoraTool_v5.0.exe`**.
*   **MỚI:** Tool sẽ hiện câu hỏi:
    > `❓ Bạn có sử dụng proxy không? (Y/N):`
    *   Gõ **`Y`** + Enter: Để bật Proxy (Load từ file proxies.txt).
    *   Gõ **`N`** + Enter: Để chạy mạng thường (Wifi/LAN).
*   Đợi nó báo **System Ready** và hiện bảng danh sách Endpoint là thành công.

---

## 🧠 3. WORKFLOW TRÊN N8N
*   Mở n8n Desktop.
*   Chọn **Import from File** -> Chọn file template mẫu `.json`.

---

## 🔗 4. SETUP ENDPOINT (QUAN TRỌNG)
Nhìn vào bảng đen CMD của Tool, bạn sẽ thấy mục **"KẾT NỐI VỚI N8N"**. Chọn 1 trong 3 loại URL để điền vào Node n8n:

| Loại | URL cần điền vào n8n | Khi nào dùng? |
| :--- | :--- | :--- |
| **1. Cloud / VPS** | Link Tunnel (VD: `https://sora-tool-xyz.loca.lt`) | Khi n8n cài trên VPS Online (Khác mạng với máy chạy Tool). *Nhớ thêm Header `Bypass-Tunnel-Reminder: true`*. |
| **2. Localhost** | `http://localhost:3000` | Khi n8n cài trên qua nodejs |
| **3. Docker** | `http://host.docker.internal:3000` | Khi n8n chạy bằng Docker Desktop trên máy này. |

---

## 🔑 5. ĐĂNG NHẬP & CÀI ĐẶT PROFILE (SETUP PROFILE)
*(Bước này để đăng nhập và lưu cấu hình mặc định cho các acc)*

1.  Trong n8n, tìm node **"Setup Profile"** (hoặc tên tương tự).
2.  Điền danh sách tài khoản vào mục `profileName`. Ví dụ: `["acc1", "acc2", "acc3"]`.
3.  **Bấm Execute Node**.
4.  Chrome sẽ bật lên lần lượt từng Profile:
    *   **Tự động đăng nhập:** Bạn nhập Email/Pass thủ công (Hoặc login Google).
    *   **Cài đặt mặc định:** Hãy chỉnh các setting sau trong Sora một lần đầu:
        *   **Thời lượng:** Chọn 10s hoặc 15s.
        *   **Khung hình:** Chọn Dọc (9:16) hoặc Ngang (16:9).
    *   Sau đó tắt Chrome đi để Tool lưu lại Profile này.

⚠️ **Lưu ý:**
*   Nếu dùng nhiều acc (`acc1`, `acc2`...), **BẮT BUỘC nên dùng Proxy** (`useProxy: true`) để tránh bị Sora phát hiện chung 1 IP -> Captcha -> Ban.

---

## 🎬 6. GEN VIDEO TỰ ĐỘNG
Sau khi đã Setup Profile xong, giờ bạn có thể chạy các node tạo video:

1.  **Text to Video:** Điền Prompt và chạy.
2.  **Image to Video:** Điền Prompt + Link ảnh và chạy.

Tool sẽ tự động:
*   Mở Profile `acc1`.
*   Fake toàn bộ thông số máy (Stealth).
*   Gõ Prompt -> Chờ Gen -> Lấy Link Video -> Trả về n8n.
*   Nếu `acc1` hết lượt/lỗi -> Tự chuyển qua `acc2`.
