# Phase 2: Login Bug Fix
Status: Done (2026-09-15, implemented + vitest 2/2 xanh cả 2 project)
Dependencies: Phase 1 (xác minh routing Login)

## Objective
Ngăn nút đăng nhập quay vô hạn khi login thất bại hoặc mất mạng.

## Root Cause Analysis

### 1. Windows (WindowsLoginScreen.tsx)
- Block `finally` **ĐÃ vô điều kiện** (dòng 181-183): `finally { setLoading(false); }`
- **Bug thực sự:** khi mạng chập chờn (`navigator.onLine === true` nên đi nhánh online, nhưng Firebase treo không resolve/reject) thì `finally` không bao giờ chạy → button quay mãi. (Offline hẳn thì `performLogin` đi nhánh local nhanh, không treo.)
- **Fix cần:** Chỉ cần thêm timeout wrapper.

### 2. Web (LoginScreen.tsx)
- Block `finally` **có điều kiện** (dòng 157-158): `finally { if (!auth.currentUser) setLoading(false); }`
- **Bug:** Điều kiện này ngăn unlock trong một số edge case + cũng bị treo promise offline.
- **Fix cần:** Sửa thành vô điều kiện + thêm timeout wrapper.

## Implementation Steps

### Step 1: Tạo Timeout Helper
Tạo file `utils/authTimeout.ts` riêng trong mỗi project (web 1 bản, win 1 bản — KHÔNG import chéo project). Cả 2 file Login trong cùng project dùng chung helper này:
```typescript
export const timeoutWrapper = <T,>(promise: Promise<T>, timeoutMs = 15000): Promise<T> => {
  return new Promise<T>((resolve, reject) => {
    const t = setTimeout(() => reject(new Error('timeout')), timeoutMs);
    promise.then(
      (v) => { clearTimeout(t); resolve(v); },
      (e) => { clearTimeout(t); reject(e); },
    );
  });
};
```

**Lưu ý ghost login:** `Promise.race`/wrapper reject không hủy được promise Firebase gốc — nếu mạng hồi sau 15s, user vẫn có thể login thành công sau toast lỗi (AuthContext tự nhận state). Đây là hành vi chấp nhận được, tester thấy user vào được sau toast timeout thì KHÔNG tính là bug.

### Step 2: Sửa WindowsLoginScreen.tsx (2 call site — cả 2 đều qua `performLogin`)
**Call site 1 — `handleLogin` (dòng ~161):**
**TRƯỚC:**
```typescript
await performLogin(email, password);
```
**SAU:**
```typescript
await timeoutWrapper(performLogin(email, password), 15000);
```

**Call site 2 — `handleSelectSavedAccount` (dòng ~56):** đăng nhập bằng tài khoản đã lưu cũng treo tương tự khi mạng chập chờn.
**TRƯỚC:**
```typescript
await performLogin(savedAcc.email, savedPassword, true);
```
**SAU:**
```typescript
await timeoutWrapper(performLogin(savedAcc.email, savedPassword, true), 15000);
```
(File này KHÔNG có luồng vân tay.)

Và trong catch block của `handleLogin`, thêm case timeout (đặt TRƯỚC nhánh `else` cuối):
```typescript
} else if (err.message === 'timeout') {
    msg = 'Kết nối quá chậm. Vui lòng kiểm tra mạng và thử lại.';
}
```

### Step 3: Sửa LoginScreen.tsx — Web (dòng ~128)
**TRƯỚC:**
```typescript
await signInWithEmailAndPassword(auth, loginEmail, password);
```
**SAU:**
```typescript
await timeoutWrapper(signInWithEmailAndPassword(auth, loginEmail, password), 15000);
```

### Step 4: Sửa LoginScreen.tsx — finally block (dòng ~157-158)
**TRƯỚC:**
```typescript
} finally {
  if (!auth.currentUser) setLoading(false);
}
```
**SAU:**
```typescript
} finally {
  setLoading(false); // Vô điều kiện!
}
```

### Step 5: Thêm toast timeout trong LoginScreen.tsx catch block
```typescript
} else if (err.message === 'timeout') {
  setError('Kết nối quá chậm. Vui lòng kiểm tra mạng và thử lại.');
}
```

### Step 6: Sửa LoginScreen.tsx phía ontap-win (giống web)
File `ontap-win/components/LoginScreen.tsx` cũng có cùng bug — áp dụng Step 3, 4, 5, 6b tương tự.

### Step 6b: Bọc timeout cho 2 luồng còn lại trong mỗi LoginScreen.tsx (web + win)
`handleLogin` không phải luồng duy nhất gọi Firebase — `handleSelectSavedAccount` và `handleBiometricAuth` cũng treo khi mạng chập chờn:
- `handleSelectSavedAccount` (dòng ~75):
```typescript
// TRƯỚC:
await signInWithEmailAndPassword(auth, savedAcc.email, savedPassword);
// SAU:
await timeoutWrapper(signInWithEmailAndPassword(auth, savedAcc.email, savedPassword), 15000);
```
- `handleBiometricAuth` (dòng ~101):
```typescript
// TRƯỚC:
await signInWithEmailAndPassword(auth, creds.email, creds.pass);
// SAU:
await timeoutWrapper(signInWithEmailAndPassword(auth, creds.email, creds.pass), 15000);
```
Cả 2 luồng này đã có `setLoading(false)` trong catch riêng — chỉ cần thêm timeout, không cần sửa finally.

### Step 7: Unit Test cho timeoutWrapper (Vitest)
Tạo file `utils/authTimeout.test.ts` (riêng mỗi project):
```typescript
import { describe, it, expect } from 'vitest';
import { timeoutWrapper } from './authTimeout';

describe('timeoutWrapper', () => {
  it('resolve nhanh khi promise thành công', async () => {
    const fast = Promise.resolve('ok');
    await expect(timeoutWrapper(fast, 1000)).resolves.toBe('ok');
  });

  it('reject với "timeout" khi promise treo quá lâu', async () => {
    const hang = new Promise(() => {}); // never resolves
    await expect(timeoutWrapper(hang, 100)).rejects.toThrow('timeout');
  });
});
```
Chạy test cho từng project:
```bash
cd ontap-web && npm run test:run -- utils/authTimeout.test.ts
cd ../ontap-win && npm run test:run -- utils/authTimeout.test.ts
```

*Lưu ý Executor: `WindowsLoginScreen.tsx` đã được verify là `setLoading(false)` nằm an toàn trong từng catch block của luồng phụ. Với `LoginScreen.tsx` (web), nhớ xác nhận lại bằng mắt các luồng phụ (`handleSelectSavedAccount`, `handleBiometricAuth`) để đảm bảo không bị rò rỉ state.*

## Files to Modify
- [ontap-win/components/WindowsLoginScreen.tsx](file:///d:/Antigravity/TNDNB/ontap-win/components/WindowsLoginScreen.tsx) — thêm timeout wrapper + toast
- [ontap-web/components/LoginScreen.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/LoginScreen.tsx) — timeout wrapper + sửa finally + toast
- [ontap-win/components/LoginScreen.tsx](file:///d:/Antigravity/TNDNB/ontap-win/components/LoginScreen.tsx) — timeout wrapper + sửa finally + toast

## Verification (Manual)
| Test Case | Thao tác | Kỳ vọng |
|-----------|---------|---------|
| Sai mật khẩu | Nhập sai pass, ấn Login | Button unlock < 2s, toast "Sai tài khoản..." |
| Mất mạng (Win) | Tắt WiFi / mạng chập chờn, ấn Login | Button unlock sau 15s, toast "Kết nối quá chậm..." |
| Mất mạng (Web) | Tắt WiFi, ấn Login | Button unlock sau 15s, toast lỗi |
| Saved-account + vân tay | Mạng chập chờn, đăng nhập bằng tài khoản đã lưu / vân tay | Button unlock sau tối đa 15s, không treo (cả 3 luồng LoginScreen + 2 luồng WindowsLoginScreen) |
| Sau lỗi | Bất kỳ lỗi nào | Input vẫn editable, có thể sửa và thử lại ngay |

---
Next Phase: [Phase 3 - Zoom](file:///d:/Antigravity/TNDNB/docs/plans/260915-1430-tndnb-updates/phase-03-zoom.md)
