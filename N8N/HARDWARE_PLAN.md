# 🖥️ Kế Hoạch Phần Cứng: N8N Server

> Tài liệu này mô tả cấu hình PC được khuyến nghị để chạy hệ thống N8N AI Super Assistant.

---

## 📋 Tổng Quan

| Tiêu chí | Quyết định |
|----------|------------|
| **Mục đích** | Server chạy n8n + Docker 24/7 |
| **AI Model** | Dùng API online (Gemini) - Không chạy local |
| **Ưu tiên** | Tiết kiệm, bền bỉ, ổn định |
| **Ngân sách** | ~6-8 triệu VND |

---

## 🏆 Cấu Hình Khuyến Nghị

### Intel Xeon E5 Workstation

| Thành phần | Specs | Giá (VND) |
|------------|-------|-----------|
| **CPU** | Intel Xeon E5-2680 v4 (14 cores / 28 threads) | 800k - 1tr |
| **Mainboard** | X99 (Huananzhi / Jingsha) | 1.5 - 2tr |
| **RAM** | 64GB DDR4 ECC (4x16GB) | 1.2 - 1.5tr |
| **SSD** | 500GB NVMe (boot + OS + n8n) | 500k |
| **HDD** | 2TB HDD (lưu video render) | 800k |
| **PSU** | 600W 80+ Bronze | 600k |
| **Case** | ATX (tản nhiệt tốt) | 300 - 500k |
| **Tản nhiệt** | Tower cooler (ID-Cooling / Jonsbo) | 200 - 400k |
| **Tổng** | | **~6-8 triệu** |

---

## ✅ Tại Sao Chọn Xeon E5?

| Lý do | Giải thích |
|-------|------------|
| **Server-grade** | Thiết kế chạy 24/7 trong datacenter |
| **RAM ECC** | Tự động sửa lỗi bit, không crash do RAM |
| **Nhiều cores** | 14 cores / 28 threads đủ cho đa nhiệm |
| **Giá rẻ** | CPU + RAM cũ rẻ hơn nhiều so với consumer mới |
| **Nâng cấp dễ** | Có thể nâng RAM lên 128GB nếu cần |

---

## 📊 Khả Năng Xử Lý

| Tác vụ | Hiệu năng | Ghi chú |
|--------|-----------|---------|
| n8n + Docker | ✅ Dư sức | ~2-4GB RAM |
| Telegram Bot | ✅ Tốt | Nhẹ |
| FFmpeg render video | ✅ OK | 14 cores giúp render nhanh |
| Whisper transcribe | ✅ OK | ~10-15 phút / 10 phút audio |
| TTS local (Valtec) | ✅ OK | Chạy được, hơi chậm |
| SoraTool (nhiều Chrome) | ✅ Tốt | 64GB RAM dư dả |
| 20+ Docker containers | ✅ Tốt | RAM nhiều |

---

## 🔌 Ước Tính Tiêu Thụ Điện

| Trạng thái | Công suất | Chi phí/tháng (~3.5k/kWh) |
|------------|-----------|---------------------------|
| Idle | 80-100W | ~200-250k |
| Load nhẹ | 120-150W | ~300-400k |
| Load nặng | 180-220W | ~450-550k |

> **Trung bình**: ~300-400k/tháng chạy 24/7

---

## 🛒 Nơi Mua

| Nguồn | Ưu điểm | Website |
|-------|---------|---------|
| xeon.vn | Chuyên Xeon, có bảo hành | https://xeon.vn |
| Shopee | Giá rẻ, nhiều combo | Tìm "combo xeon e5 2680 v4" |
| Facebook | Thanh lý máy chủ giá tốt | Group "Thanh lý máy chủ" |

---

## 💻 Hệ Điều Hành Khuyến Nghị

| OS | Ưu điểm | Dùng khi |
|----|---------|----------|
| **Ubuntu Server 22.04 LTS** | Nhẹ, ổn định, Docker native | Khuyến nghị chính |
| **Proxmox VE** | Quản lý VM/container dễ | Nếu cần virtualization |
| **Windows Server** | Quen thuộc | Nếu cần chạy app Windows |

---

## 🔧 Checklist Sau Khi Mua

- [ ] Test RAM ECC hoạt động đúng
- [ ] Cài Ubuntu Server 22.04 LTS
- [ ] Cài Docker + Docker Compose
- [ ] Deploy n8n container
- [ ] Cấu hình SSH remote access
- [ ] Setup static IP trong mạng LAN
- [ ] Cài đặt UPS (khuyến nghị) để tránh mất điện đột ngột
- [ ] Backup strategy cho workflows

---

## 🌐 Dịch Vụ AI Online (Thay Thế Local)

| Dịch vụ | Dùng cho | Chi phí |
|---------|----------|---------|
| **Google Gemini API** | LLM chính | Miễn phí (có quota) |
| **Google Veo 3 (NanoAI)** | Tạo video AI | Theo API calls |
| **Fal.AI** | Face Swap | Theo API calls |
| **OpenAI Whisper API** | Transcribe (nếu cần nhanh) | $0.006/phút |

> **Lợi ích**: Không cần GPU đắt tiền, chỉ trả tiền khi dùng.

---

## 📝 Ghi Chú Bổ Sung

### Nâng Cấp Trong Tương Lai (Nếu Cần)

| Nâng cấp | Chi phí | Khi nào |
|----------|---------|---------|
| Thêm 64GB RAM → 128GB | +1.2tr | Nếu chạy nhiều containers |
| Thêm SSD 1TB | +800k | Nếu cần lưu trữ nhiều |
| Thêm GPU GTX 1080 Ti | +3.5tr | Nếu muốn chạy AI local sau |

### Phương Án Thay Thế (Cùng Giá)

| Cấu hình | Giá | So sánh |
|----------|-----|---------|
| PC Esport Ryzen 5 + RTX 3050 | 15tr | Mạnh hơn nhưng đắt gấp đôi |
| Mini PC Beelink SER5 | 12-13tr | Nhỏ gọn nhưng RAM ít |
| VPS Cloud (Vultr/Hetzner) | ~500k/tháng | Không cần mua máy, nhưng tốn tiền dài hạn |

---

## 🔥 Option 2: Dual Xeon E5-2680 v4 (NÂNG CẤP)

> Cấu hình mạnh hơn Option 1, phù hợp nếu tìm được deal tốt.

### Thông Số Kỹ Thuật

| Thành phần | Specs | Giá ước tính (VND) | Tình trạng |
|------------|-------|--------------------|------------|
| **CPU** | 2x Intel Xeon E5-2680 v4 (28 cores / 56 threads tổng) | 700k - 800k | Cũ |
| **Mainboard** | X99 Dual OEM D4 (8 slot RAM) | 1.3tr - 1.5tr | Mới |
| **RAM** | 2x 32GB DDR4 ECC = 64GB | 1.2tr - 1.6tr | Cũ |
| **GPU** | GTX 1060 6GB | 2tr - 2.2tr | Cũ |
| **SSD** | 500GB SATA | 400k - 500k | Cũ |
| **PSU** | XIGMATEK X650 (650W) | 850k - 950k | Mới |
| **Case** | Vỏ kính Dual + 3 Fan | 400k - 600k | Mới |
| **Tản nhiệt** | 2x Tản khí 4 ống đồng | 400k - 600k | Mới |
| **Tổng** | | **7.25tr - 8.75tr** | |

### So Sánh Option 1 vs Option 2

| Tiêu chí | Option 1 (Single Xeon) | Option 2 (Dual Xeon) | Kết luận |
|----------|------------------------|----------------------|----------|
| **CPU Cores** | 14 cores / 28 threads | 28 cores / 56 threads | ✅ Option 2 gấp đôi |
| **RAM** | 64GB ECC | 64GB ECC | = Tương đương |
| **GPU** | Không có | GTX 1060 6GB | ✅ Option 2 có GPU |
| **SSD** | 500GB NVMe | 500GB SATA | ⚠️ Option 1 nhanh hơn |
| **Giá** | ~6-8 triệu | ~7.25-8.75 triệu | ⚠️ Option 2 đắt hơn chút |
| **Tiêu thụ điện** | ~80-150W | ~120-220W | ⚠️ Option 2 tốn điện hơn |

### Ưu Điểm Option 2

- ✅ CPU mạnh gấp đôi - render video, Docker, automation nhanh hơn nhiều
- ✅ Có GPU - chạy được AI local nhẹ (Whisper, TTS)
- ✅ Main mới - ổn định, bảo hành
- ✅ Nguồn mới - an toàn, bảo hành

### Nhược Điểm Option 2

- ⚠️ Tốn điện hơn (~100-150k/tháng thêm)
- ⚠️ SSD SATA chậm hơn NVMe (có thể nâng cấp sau)
- ⚠️ Cần HDD riêng nếu lưu video render

### Giá Hợp Lý Cho Option 2

| | Mức giá |
|---|---------|
| 🔥 **Deal tốt** | Dưới 7.5 triệu |
| ✅ **Giá hợp lý** | 7.5 - 8 triệu |
| ⚠️ **Giá cao** | Trên 9 triệu |

---

## ✅ Kết Luận

> **Xeon E5-2680 v4 + 64GB ECC** với giá **~7 triệu** là lựa chọn **tiết kiệm và ổn định nhất** cho hệ thống N8N AI Super Assistant khi sử dụng AI API online.

**Ưu điểm chính:**
- 💰 Tiết kiệm ~8 triệu so với PC mới
- 🔒 Ổn định với RAM ECC
- 🔄 Chạy 24/7 bền bỉ
- 📦 Đủ mạnh cho mọi tác vụ trong kế hoạch
