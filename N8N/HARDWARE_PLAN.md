# 🖥️ Kế Hoạch Phần Cứng: N8N Server

> Tài liệu này so sánh 2 cấu hình PC để chạy hệ thống N8N AI Super Assistant.

---

## ⚖️ So Sánh 2 Cấu Hình

| Thành phần | Cấu hình A | Cấu hình B | Khác biệt |
|------------|-----------|-----------|-----------|
| **CPU** | 2x E5-2680 v4 cũ | 2x E5-2680 v4 cũ | = Giống nhau |
| **Mainboard** | X99 DUAL OEM D4 (New) | X99 DUAL OEM D4 (New) | = Giống nhau |
| **RAM** | 64GB (2x32GB DDR4 ECC cũ) | **96GB (3x32GB DDR4 ECC cũ)** | B +32GB |
| **GPU** | GTX 1060 6GB cũ | **GTX 1080 8GB cũ** | B +2GB VRAM |
| **SSD** | 500GB cũ | 500GB cũ | = Giống nhau |
| **Nguồn** | XIGMATEK X650 (New) | XIGMATEK X650 (New) | = Giống nhau |
| **Case** | Vỏ kính DUAL + 3 FAN | Vỏ kính DUAL + 3 FAN | = Giống nhau |
| **Tản nhiệt** | 2x Tản khí 4 ống đồng (New) | 2x Tản khí 4 ống đồng (New) | = Giống nhau |

---

## 📊 So Sánh Hiệu Năng

### CPU (Giống nhau cả 2)
- **28 cores / 56 threads** (dual E5-2680 v4)
- Cinebench Multi: ~24,000 điểm
- Đủ cho 50-100+ Docker containers

### RAM

| Tác vụ | Cấu hình A (64GB) | Cấu hình B (96GB) |
|--------|------------------|------------------|
| n8n + Docker cơ bản | ✅ Dư | ✅ Dư |
| SoraTool 5 Chrome | ✅ OK | ✅ Thoải mái hơn |
| SoraTool 10+ Chrome | ⚠️ Có thể thiếu | ✅ OK |
| Nhiều VM/container | ⚠️ Giới hạn | ✅ Tốt hơn |

### GPU

| Tác vụ | Cấu hình A (1060 6GB) | Cấu hình B (1080 8GB) |
|--------|----------------------|----------------------|
| Whisper transcribe | ✅ ~2-3 phút/10p audio | ✅ ~1-2 phút (nhanh hơn ~30%) |
| TTS local | ✅ Nhanh | ✅ Nhanh hơn |
| Gemma 2B-4B | ✅ Mượt | ✅ Mượt |
| **Gemma 9B (4-bit)** | ⚠️ **Vừa khít 6GB** | ✅ **Thoải mái 8GB** |
| Gemma 12B | ❌ Không đủ VRAM | ⚠️ Vừa khít |

---

## 💰 Chênh Lệch Giá (Ước tính)

| Thành phần khác biệt | Giá |
|---------------------|-----|
| +1 thanh RAM 32GB ECC | ~600-800k |
| GTX 1080 thay 1060 | ~800k-1.2tr |
| **Tổng chênh lệch** | **~1.5-2 triệu** |

---

## 🎯 Khuyến Nghị

### Chọn **Cấu hình A** (64GB + 1060) nếu:
- ✅ Ưu tiên tiết kiệm
- ✅ Chỉ dùng API online (Gemini), không chạy LLM local
- ✅ Chạy SoraTool ≤5 Chrome profiles
- ✅ Model AI lớn nhất: Gemma 4B

### Chọn **Cấu hình B** (96GB + 1080) nếu:
- ✅ Muốn chạy **Gemma 9B local** thoải mái
- ✅ Whisper/TTS nhanh hơn ~30%
- ✅ Chạy SoraTool 10+ Chrome profiles
- ✅ Future-proof cho mở rộng sau này

---

## 🏆 Kết Luận

| OS | Ưu điểm | Dùng khi |
|----|---------|----------|
| **Ubuntu Server 22.04 LTS** | Nhẹ, ổn định, Docker native | Khuyến nghị chính |
| **Proxmox VE** | Quản lý VM/container dễ | Nếu cần virtualization |
| **Windows Server** | Quen thuộc | Nếu cần chạy app Windows |

---

## 🔧 Checklist Sau Khi Mua

- [ ] Test RAM ECC hoạt động (memtest86)
- [ ] Cài Ubuntu Server 22.04 LTS
- [ ] Cài NVIDIA drivers
- [ ] Cài Docker + Docker Compose
- [ ] Deploy n8n container
- [ ] Setup SSH + static IP
- [ ] Thêm HDD 2TB nếu cần lưu video
