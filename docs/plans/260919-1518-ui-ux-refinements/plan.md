# Unified UI/UX Refinements & Architecture Fix Plan (260919-1518)

## Overview
Based on recent user testing and architectural audits, we need to address critical issues across UI/UX and backend integration:
1. **Navbar Overlap Fix:** Prevent TopNavbar from obscuring main content.
2. **Result Screen Optimization:** Eliminate nested scrolling in the "Review attempt" section.
3. **Answer Sheet Sync:** Align Web's answer sheet layout and selection mechanism with the Windows App (5-column layout).
4. **Fix Update Architecture:** Revert broken Supabase update logic back to GitHub Releases for `electron-updater` compatibility. Remove hardcoded Supabase keys.
5. **Unify Exam Screen Naming:** Rename `ExamQuizScreen2 → ExamQuizScreen` triệt để (gồm `ThiTrucTuyenPage`), xóa 2 file V1 chết.
6. **Release Build:** Trigger `/tndnb-build` to package and release v3.19.2 safely.

## Tech Stack
- Frontend: React / Next.js / Vite
- Desktop: Electron / electron-updater
- Backend & Storage: Firebase (Usage Config / Settings) / Supabase (TND Questions Bucket)
- Distribution: GitHub Releases API

## Phases
1. [Phase 1: Audit & Layout Fixes](./phase-01-audit-layout.md)
2. [Phase 2: UI Implementation](./phase-02-implement-ui.md)
3. [Phase 3: Fix Update Architecture (GitHub Releases)](./phase-03-architecture-fix.md)
4. [Phase 4: Rename ExamQuizScreen2, Fix QuizScreen & Mobile UX](./phase-04-rename-cleanup.md)
5. Phase 5: Release v3.19.2 (via /tndnb-build) — Xem trực tiếp trong `task.md`
