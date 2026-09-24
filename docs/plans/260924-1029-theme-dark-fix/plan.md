# Plan: Theme Dark Variant Fix (P0/P1/P2)

Created: 2026-09-24 10:29 (+07:00)
Status: 🟡 In Progress

## Overview

`@custom-variant dark` trong `ontap-web/theme.css:2` chỉ match `data-theme='dark'`, khiến toàn bộ class `dark:` chết trên 5 theme tối còn lại (modern, sunrise, tri-an, noel, premium) → chữ tối trên nền tối (~1.5:1). Cộng thêm các điểm cứng không `dark:` (giấy thi, page thi trực tuyến, search box). Fix theo 3 phase: 1 dòng variant (P0) + token hóa điểm cứng (P1) + QA ma trận (P2).

## Tech Stack

- Frontend: React + Vite + Tailwind CSS v4 (`@tailwindcss/vite`)
- Theming: CSS vars 8 theme qua `data-theme` (`ontap-web/theme.css`), tokens `@theme`

## Phases

| Phase | Name | Status | Progress |
|-------|------|--------|----------|
| 00 | P0: Mở rộng dark variant (1 dòng) | ⬜ Pending | 0% |
| 01 | P1: Token hóa điểm cứng | ⬜ Pending | 0% |
| 02 | P2: QA ma trận 8 theme | ⬜ Pending | 0% |

## Quick Commands

- Start Phase 0: `/code phase-00`
- Check progress: `/next`
- Save context: `/save-brain`

## Definition of Done

1. `npx tsc --noEmit` sạch trong `ontap-web`.
2. `npm run build` pass, CSS bundle chứa utilities.
3. Gạt đủ 8 theme (light, dark, modern, classic, sunrise, tri-an, noel, premium) × 6 màn (chonbang, chonmon, quiz, results, dashboard, modal): chữ đọc được, không trắng chói, không chìm.
4. Rollback: revert 1 commit là về hiện trạng (thay đổi thuần class + 1 dòng CSS).
