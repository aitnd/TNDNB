# Plan: Sửa lỗi xác thực Monetag bằng cách dùng thẻ HTML head thô
Created: 2026-06-30T10:31:00Z
Status: 🟡 In Progress

## Overview
Do Next.js biến đổi component `<Script>` thành JS loading queue (`self.__next_s.push`), bot quét tĩnh của Monetag không phát hiện được thẻ nhúng trên trang. Kế hoạch này sẽ chuyển đổi cách nhúng bằng cách sử dụng thẻ `<head>` thô trực tiếp trong Root Layout của Next.js để phục vụ mã HTML thô chuẩn cho bot kiểm tra.

## Tech Stack
- Next.js App Router (app/layout.tsx)

## Phases

| Phase | Name | Status | Progress |
|-------|------|--------|----------|
| 01 | Cập nhật app/layout.tsx | ⬜ Pending | 0% |
| 02 | Xác thực live & Vercel | ⬜ Pending | 0% |

## Quick Commands
- Start Phase 1: `/code phase-01`
- Check progress: `/next`
- Save context: `/save-brain`
