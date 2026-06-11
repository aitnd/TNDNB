# Plan: Triển khai Hệ thống v3.9.6
Created: 2026-06-11
Status: 🟡 In Progress

## Overview
Kế hoạch triển khai phiên bản v3.9.6 bao gồm việc commit các thay đổi phân tách vai trò "Ban Lãnh Đạo" (leader) và "Quản Lý" (manager), cập nhật CHANGELOG, chạy kiểm thử và đưa phiên bản mới lên môi trường thực tế (Web & Windows Electron).

## Tech Stack
- Web: Vite + React + TailwindCSS (Deploy Vercel/Firebase)
- Win: Electron + Electron-builder (Build setup EXE)
- Portal: Next.js (Deploy Vercel/Host)
- Database: Firestore (Tự động khởi tạo key `leader` khi truy cập)

## Phases

| Phase | Name | Status | Progress |
|-------|------|--------|----------|
| 01 | Commit & Changelog | ✅ Complete | 100% |
| 02 | Kiểm thử & Deploy bản Web | ✅ Complete | 100% |
| 03 | Đóng gói & Phát hành bản Win (EXE) | ✅ Complete | 100% |
| 04 | Xác minh trên Production | ⬜ Pending | 0% |

## Quick Commands
- Bắt đầu Phase 1: `/code phase-01`
- Kiểm tra tiến độ: `/next`
- Lưu context: `/save-brain`
