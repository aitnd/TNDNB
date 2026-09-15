# Plan: Sửa lỗi hiển thị Huy hiệu Quyền (MiniRoleBadge) cho Admin/Lãnh đạo
Created: 2026-06-30T10:04:00Z
Status: 🟡 In Progress

## Overview
Lỗi không hiển thị huy hiệu đặc quyền cho các tài khoản Premium (Admin, Super Admin, Lãnh đạo) do thuộc tính `opacity` bị bỏ quên trong object cấu hình `animate` của Framer Motion. Trạng thái `initial` bắt đầu bằng `opacity: 0` nhưng khi chạy hiệu ứng lấp lánh (pulsing scale/boxShadow) thì độ mờ vẫn là `0` (ẩn). Ta cần thêm `opacity: 1` cho nhánh premium.

## Tech Stack
- React
- Framer Motion

## Phases

| Phase | Name | Status | Progress |
|-------|------|--------|----------|
| 01 | Implementation (Web & Win) | ✅ Complete | 100% |
| 02 | Verification & Testing | 🟡 In Progress | 50% |

## Quick Commands
- Start Phase 1: `/code phase-01`
- Check progress: `/next`
- Save context: `/save-brain`
