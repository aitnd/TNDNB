# Kế hoạch: Nâng cấp Hệ thống Huy hiệu 3D & 22 Thành tích (Gamification v2)
Created: 2026-06-29 17:24
Status: 🟡 In Progress
Progress: 50%

## 1. Overview (Tổng quan)
Nâng cấp toàn diện hệ thống Huy hiệu (Achievements & Roles) của TNDNB từ 11 cái MVP lên đầy đủ 22 thành tích + 6 Role. Các huy hiệu được trang bị hiệu ứng 3D Parallax Tilt, lấp lánh phản quang (Holographic Foil), phát sáng Neon dựa trên Framer Motion và CSS gradients xếp lớp.
Khi mở khóa thành công, màn hình sẽ bung hiệu ứng pháo hoa giấy (Confetti Canvas) và hiệu ứng tỏa tia sáng xoay vòng (Radial Rays).
Tích hợp MiniRoleBadge cạnh tên người dùng ở:
- Profile cá nhân (`/ontap/profile`)
- Top Navbar
- UserManagerScreen (`/ontap/usermanager`)
- StudentsTab (Quản lý lớp)
Đồng thời, Admin có quyền cấp/thu hồi huy hiệu trực tiếp tại UserManagerScreen và StudentsTab.

## 2. Tech Stack
- **Frontend Core:** React 19 (ontap-web) / React 18 (next.js root/ontap-win)
- **Styling:** CSS Gradients & Mix-blend-modes + Framer Motion (for physics-based elastic springs) + Custom Tailwind classes
- **Particles / Celebrations:** Pure Canvas Confetti (HTML5 Canvas + requestAnimationFrame)
- **Database:** Cloud Firestore (sub-collections `users/{uid}/userBadges/{badgeId}`)

## ⚠️ QUY TẮC ĐỒNG BỘ WEB + WIN (BẮT BUỘC)

> **Mọi thay đổi đều PHẢI được thực hiện song song trên CẢ HAI bản:**
> - `ontap-web/` (Bản Web — React 19)
> - `ontap-win/` (Bản Windows App — React 18 + Electron/Capacitor)

| File / Component | Web Path | Win Path |
|-----------------|----------|----------|
| **badges.ts** | `ontap-web/constants/badges.ts` | `ontap-win/constants/badges.ts` |
| **badgeService.ts** | `ontap-web/services/badgeService.ts` | `ontap-win/services/badgeService.ts` |
| **BadgeIcon3D.tsx** | `ontap-web/components/Badges/BadgeIcon3D.tsx` | `ontap-win/components/Badges/BadgeIcon3D.tsx` |
| **ConfettiCanvas.tsx** | `ontap-web/components/Badges/ConfettiCanvas.tsx` | `ontap-win/components/Badges/ConfettiCanvas.tsx` |
| **BadgeUnlockPopup.tsx** | `ontap-web/components/Badges/BadgeUnlockPopup.tsx` | `ontap-win/components/Badges/BadgeUnlockPopup.tsx` |
| **MiniRoleBadge.tsx** | `ontap-web/components/Badges/MiniRoleBadge.tsx` | `ontap-win/components/Badges/MiniRoleBadge.tsx` |
| **BadgeList.tsx** | `ontap-web/components/Badges/BadgeList.tsx` | `ontap-win/components/Badges/BadgeList.tsx` |
| **AccountScreen.tsx** | `ontap-web/components/AccountScreen.tsx` | `ontap-win/components/AccountScreen.tsx` |
| **UserManagerScreen.tsx** | `ontap-web/components/UserManagerScreen.tsx` | `ontap-win/components/UserManagerScreen.tsx` |
| **StudentsTab.tsx** | `ontap-web/components/ClassDetail/StudentsTab.tsx` | `ontap-win/components/ClassDetail/StudentsTab.tsx` |
| **App.tsx** (trigger) | `ontap-web/App.tsx` | `ontap-win/App.tsx` |

**Nguyên tắc:** Sửa Web xong → Copy/Sync ngay sang Win. Không bao giờ để lệch phiên bản giữa 2 bản.

## 3. Phases & Progress

| Phase | Name | Status | Progress | Web | Win |
|-------|------|--------|----------|-----|-----|
| [01](file:///d:/Antigravity/TNDNB/docs/plans/260629-1724-badges-3d/phase-01-database.md) | Database & Seed Script | ✅ Done | 100% | ✅ | ✅ |
| [02](file:///d:/Antigravity/TNDNB/docs/plans/260629-1724-badges-3d/phase-02-backend.md) | Backend & BadgeService Updates | ✅ Done | 100% | ✅ | ✅ |
| [03](file:///d:/Antigravity/TNDNB/docs/plans/260629-1724-badges-3d/phase-03-frontend-components.md) | 3D Shiny Badges & Confetti Components | ✅ Done | 100% | ✅ | ✅ |
| [04](file:///d:/Antigravity/TNDNB/docs/plans/260629-1724-badges-3d/phase-04-integration-views.md) | Profile Integration & Auto-unlocks | 🟡 In Progress | 30% | 🟡 | ⬜ |
| [05](file:///d:/Antigravity/TNDNB/docs/plans/260629-1724-badges-3d/phase-05-admin-panel.md) | Admin Dashboards Integration | ⬜ Pending | 0% | ⬜ | ⬜ |
| [06](file:///d:/Antigravity/TNDNB/docs/plans/260629-1724-badges-3d/phase-06-testing.md) | Verification & Build Loops | ⬜ Pending | 0% | ⬜ | ⬜ |

## 4. Quick Commands
- Start Phase 1: `/code phase-01`
- Check progress: `/next`
- Save context: `/save-brain`

