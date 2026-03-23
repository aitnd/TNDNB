# Plan: Khôi phục chức năng Quản lý Học viên (Excel & Thao tác cá nhân)
Created: 2026-03-23T06:45
Status: 🟡 In Progress

## Overview
Khôi phục 3 tính năng quan trọng trong quản lý học viên thuộc Cấu trúc Component mới của ClassDetail:
1. Tính năng Import từ Excel (Tạo account hàng loạt).
2. Chức năng Reset Mật Khẩu (nút chìa khoá).
3. Chức năng Cho Phép Đăng Nhập Offline (nút cột sóng/máy bay).

## Tech Stack
- Frontend: React (Next.js/Vite), TailwindCSS, Framer Motion
- Backend/DB: Firebase Cloud Firestore + Custom logic

## Phases

| Phase | Name | Status | Progress |
|-------|------|--------|----------|
| 01 | Import Học viên bằng Excel | ✅ Done | 100% |
| 02 | Khôi phục Reset Pass & Tắt Offline | ✅ Done | 100% |
| 03 | Đồng bộ `ontap-web` và `ontap-win` | ✅ Done | 100% |
| 04 | Testing & Refinements | 🟡 In Progress | 10% |

## Quick Commands
- Start Phase 1: `/code phase-01`
- Check progress: `/next`
- Save context: `/save-brain`
