# Phase 00: P0 — Mở rộng dark variant (1 dòng)

Status: ⬜ Pending
Dependencies: None

## Objective

Hồi sinh toàn bộ class `dark:` trên 6 theme tối bằng 1 dòng CSS. Không đụng file nào khác.

## Requirements

### Functional

- [ ] `dark:` kích hoạt trên `dark, modern, sunrise, tri-an, noel, premium`
- [ ] `light, classic` không ảnh hưởng (variant off)

### Non-Functional

- [ ] Không tăng specificity gây vỡ style hiện tại ở theme `dark`

## Implementation Steps

1. [ ] Mở `ontap-web/theme.css:2`, thay dòng variant hiện tại:
   ```css
   @custom-variant dark (&:where(
     [data-theme='dark'], [data-theme='dark'] *,
     [data-theme='modern'], [data-theme='modern'] *,
     [data-theme='sunrise'], [data-theme='sunrise'] *,
     [data-theme='tri-an'], [data-theme='tri-an'] *,
     [data-theme='noel'], [data-theme='noel'] *,
     [data-theme='premium'], [data-theme='premium'] *));
   ```
2. [ ] Chạy `cd ontap-web && npx tsc --noEmit` (expect: pass, CSS không ảnh hưởng typecheck)
3. [ ] Chạy `cd ontap-web && npm run build` (expect: pass)
4. [ ] Gạt nhanh 8 theme ở `/ontap/chonbang`: `h1` trắng trên nền tối ở cả 6 theme tối; `light/classic` giữ nguyên

## Files to Create/Modify

- `ontap-web/theme.css:2` — mở rộng selector variant

## Test Criteria

- [ ] `dark:text-white` hiển thị trắng ở premium/modern (trước fix: đen chìm)
- [ ] `light`/`classic` không đổi visual

## Notes

- Hiệu quả ngay ~75 `dark:text-white` + hàng trăm `dark:bg-*` toàn app. Đây là fix chặn chảy máu, P1 làm tiếp điểm cứng.

---
Next Phase: [Phase 01](./phase-01-hardcoded.md)
