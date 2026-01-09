# 🛠️ Hướng Dẫn Tích Hợp Proxy Monetization

## ⚠️ Lưu Ý Quan Trọng

- **Bright Data**: Yêu cầu App >10k lượt cài. Không phù hợp cho App mới.
- **Honeygain SDK**: Yêu cầu thấp hơn, dễ đăng ký. **ĐỀ XUẤT CHO APP MỚI**.

---

## 🍯 Honeygain SDK - Hướng Dẫn Đăng Ký (Cho App Mới)

### Bước 1: Đăng Ký Publisher
1. Truy cập: **https://honeygain.com/sdk**
2. Bấm **"Get Started"** hoặc **"Become a Partner"**
3. Điền form với thông tin:
   - **Loại App**: Ôn thi trắc nghiệm (Education/Utility)
   - **Link App/Website**: `daotaothuyenvien.com`
   - **DAU (Daily Active Users)**: Ước tính số người dùng mỗi ngày (có thể khai dưới 10k)
   - **Khu vực chính**: Việt Nam
   - **Thời gian sử dụng**: Ước tính ~30 phút/ngày (ôn thi)
4. Gửi form và chờ email phản hồi (1-3 ngày làm việc)

**☎️ Liên hệ trực tiếp**: Gửi email đến `sdkhelp@honeygain.com` với nội dung sau:

```
Subject: SDK Partnership Request - Vietnam Education App

Hi Honeygain Team,

I would like to integrate Honeygain SDK into my education app.

App Details:
- Name: Đào Tạo Thuyền Viên (Maritime Training Vietnam)
- Type: Quiz/Study App for maritime workers
- Platforms: Android APK, Windows Desktop (Electron)
- Region: Vietnam
- Estimated DAU: [Điền số DAU ước tính]
- Website: daotaothuyenvien.com

Please let me know the next steps.

Best regards,
[Tên của bạn]
```

### Bước 2: Chờ Xét Duyệt
- Honeygain sẽ review và gửi lại **SDK Package** + **API Token** riêng.
- Thời gian xét duyệt: 1-5 ngày làm việc.

### Bước 3: Tích Hợp SDK (Sau Khi Được Duyệt)
Honeygain sẽ cung cấp:
- **Android**: File `.aar` + hướng dẫn chèn vào `build.gradle`
- **Windows**: Thường cung cấp SDK dạng executable hoặc DLL

Code mẫu sẽ được cung cấp bởi Honeygain Team sau khi bạn được duyệt.

---

## 📊 So Sánh Nhanh

| Tiêu chí | Bright Data | Honeygain |
|----------|-------------|-----------|
| Yêu cầu lượt cài | >10,000 | Không giới hạn |
| Xét duyệt | Rất khó | Dễ hơn |
| Trả tiền | Theo DAU | Theo GB |
| Phù hợp | App lớn | App mới bắt đầu ✅ |

---

## ⚙️ Trạng Thái Hiện Tại

| Platform | SDK | Status |
|----------|-----|--------|
| Android | Honeygain | ⏳ Chờ đăng ký và nhận SDK |
| Windows | Honeygain | ⏳ Chờ đăng ký và nhận SDK |
