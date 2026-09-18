# Phase 02: Bug Fixes (Detailed)

**Mục tiêu:** Xử lý các lỗi tồn đọng nghiêm trọng ảnh hưởng đến trải nghiệm người dùng (Bug 1 & Bug 2).
**Dependencies:** Phase 01 hoàn thành.

---

## Bug 1: Màn hình lịch sử báo "KHÔNG ĐẠT" dù đúng hết

### 📋 Nguyên nhân gốc (Root Cause Analysis)

Có **3 vị trí** dùng 3 logic khác nhau, tất cả đều sai:

| Vị trí | Logic hiện tại | Vấn đề |
|--------|---------------|--------|
| `ontap-web/components/ExamResultsScreen.tsx:20` | `isPass = score >= 25` (hardcode) | Chỉ đúng cho bài Thi thử 30 câu. Bài Ôn tập 18 câu → 18 < 25 → **luôn KHÔNG ĐẠT** dù đúng hết |
| `ontap-web/components/HistoryScreen.tsx:102` | `isPass = score/total >= 0.7` | Dùng tỷ lệ 70% → không khớp quy tắc nghiệp vụ |
| `ontap-web/components/ClassDetail/Modals/HistoryModal.tsx:66` | `h.isPassed ? 'ĐẠT' : 'KHÔNG ĐẠT'` | Trường `isPassed` **KHÔNG hề được lưu** vào DB → luôn `undefined` → falsy → hiện KHÔNG ĐẠT |

Hàm `saveExamResult()` trong `ontap-web/services/userService.ts:159` lưu `score`, `totalQuestions`, `type` nhưng **thiếu trường `isPassed`**.

### 📐 Quy tắc nghiệp vụ (Business Rules - từ Owner)

> **Thi thử (30 câu):** Điểm >= 25/30 là ĐẠT.
> **Ôn tập (N câu):** Phải đạt tối đa (N/N) mới ĐẠT. VD: 18/18 mới ĐẠT, 17/18 là KHÔNG ĐẠT.

### ✅ Checklist sửa lỗi

- [ ] **Bước 1.1: Tạo hàm helper `calculateIsPass()` dùng chung**
  - **File tạo mới:** `ontap-web/utils/examUtils.ts`
  - **Logic:** 
    - Nhận `score`, `totalQuestions`, `examType: 'Ôn tập' | 'Thi thử'`
    - Nếu `examType === 'Thi thử'` → `isPass = score >= 25`
    - Nếu `examType === 'Ôn tập'` → `isPass = score === totalQuestions`
  - **Code Snippet:**
    ```typescript
    // ontap-web/utils/examUtils.ts
    export function calculateIsPass(
      score: number, 
      totalQuestions: number, 
      examType: 'Ôn tập' | 'Thi thử'
    ): boolean {
      if (examType === 'Thi thử') {
        return score >= 25; // Đề thi thử luôn 30 câu, cần >= 25 để đạt
      }
      // Ôn tập: phải đúng hết mới đạt
      return score === totalQuestions;
    }
    ```
  - **Copy hàm này sang:** `ontap-win/utils/examUtils.ts` (giữ logic y hệt)

- [ ] **Bước 1.2: Sửa `ExamResultsScreen.tsx` (cả web và win)**
  - **Files sửa:** 
    - `ontap-web/components/ExamResultsScreen.tsx` (dòng 20)
    - `ontap-win/components/ExamResultsScreen.tsx` (dòng 20)
  - **Trước:** `const isPass = score >= 25;`
  - **Sau:** 
    ```tsx
    import { calculateIsPass } from '../utils/examUtils';
    // ...
    // Cần truyền thêm prop examType vào component (hoặc suy từ quiz)
    const isPass = calculateIsPass(score, totalQuestions, examType);
    ```
  - ⚠️ **LƯU Ý:** Component `ExamResultsScreen` này cần nhận thêm prop `examType` từ nơi gọi nó (`AppRoutes.tsx`).
    - Web (`AppRoutes.tsx`): 2 chỗ — `<ExamResultsScreen>` dòng 247 + 337.
    - Win (`AppRoutes.tsx`): 1 chỗ — `<ExamResultsScreen>` dòng 242.
    - *(KHÔNG truyền vào `<ResultsScreen>` vì component đó không render trạng thái Đạt/Không đạt, tránh lỗi TypeScript).*
    - Suy `examType` từ loại bài: route thi thử → `'Thi thử'`, còn lại `'Ôn tập'`. Kiểm tra luồng truyền props.

- [ ] **Bước 1.3: Sửa `HistoryScreen.tsx` (CHỈ bản Web)**
  - **File sửa:** `ontap-web/components/HistoryScreen.tsx` (dòng 102)
  - ⚠️ **KHÔNG sửa** `ontap-win/components/HistoryScreen.tsx` — bản Win không hiển thị cột ĐẠT/KHÔNG ĐẠT (đã verify), chỉ hiện bảng Điểm/Ngày.
  - **Trước:** `const isPass = item.score / (item.totalQuestions || 1) >= 0.7;`
  - **Sau:**
    ```tsx
    import { calculateIsPass } from '../utils/examUtils';
    // item.type chính là 'Ôn tập' | 'Thi thử' (đã lưu trong DB)
    const examType = item.type === 'Thi thử' ? 'Thi thử' : 'Ôn tập';
    const isPass = calculateIsPass(item.score, item.totalQuestions, examType);
    ```

- [ ] **Bước 1.4: Sửa logic lưu kết quả thi để thêm trường `isPassed` (cả Web & Win)**
  - **Files sửa:**
    - `ontap-web/services/userService.ts` (hàm `saveExamResult`, đã có `examType`/`title` — thêm thẳng)
    - `ontap-web/services/historyService.ts` (hàm `saveExamResult(userId, quiz, score, answers, timeTaken)` — KHÁC chữ ký: suy `examType` từ nơi gọi hoặc thêm tham số, `title` lấy `quiz.title`)
    - `ontap-win/services/userService.ts` (hàm `saveExamResult` — cả 2 nhánh online `addDoc` và offline `saveResultOffline`)
    - `ontap-win/services/syncService.ts` (hàm `syncData`)
  - **Bổ sung type:** thêm `isPassed?: boolean` vào `ExamResult` (historyService 2 bên) và `OfflineResult` (win offlineService) — không là lỗi TS khi đọc/ghi.
  - **Logic:** Thêm trường `isPassed` khi ghi vào Firestore `exam_results` — MỖI HÀM MỘT CÁCH (chữ ký khác nhau, không copy chung 1 snippet):
    - `userService.ts` (web): đã có `score, totalQuestions, examType, title` — thêm thẳng `isPassed: calculateIsPass(...)` (snippet mẫu dưới dùng được nguyên văn).
    - `historyService.ts` (web + win): chữ ký `(userId, quiz, score, answers, timeTaken)` — suy `examType`/`title` từ `quiz` (hoặc thêm tham số), rồi mới tính `isPassed`.
    - `userService.ts` (win): vá cả 2 nhánh online (`addDoc`) và offline (`saveResultOffline`).
    - Bổ sung type: thêm `isPassed?: boolean` vào `ExamResult` (historyService 2 bên) và `OfflineResult` (win offlineService).
  - **Sau (ví dụ ở userService.ts / historyService.ts):**
    ```typescript
    import { calculateIsPass } from '../utils/examUtils';
    // ...bên trong hàm:
    const isPassed = calculateIsPass(score, totalQuestions, examType);
    
    await addDoc(collection(db, 'exam_results'), {
      studentId: userId,
      licenseId: licenseId,
      score: score,
      totalQuestions: totalQuestions,
      timeTaken: timeTaken,
      completedAt: serverTimestamp(),
      type: examType,
      quizTitle: title,
      isPassed: isPassed  // ← THÊM TRƯỜNG NÀY
    });
    ```
  - ⚠️ **DỮ LIỆU CŨ:** Các bản ghi cũ trong Firestore không có trường `isPassed`. Cần fallback ở UI: nếu `h.isPassed === undefined` → tính lại bằng `calculateIsPass(h.score, h.totalQuestions, h.type)`.

- [ ] **Bước 1.5: Sửa tất cả HistoryModal (8 file) để fallback dữ liệu cũ**
  - **Các file sửa:**
    - `ontap-web/components/ClassDetail/Modals/HistoryModal.tsx`
    - `ontap-web/components/ClassDetail/Modals/index.tsx`
    - `ontap-web/components/ClassManagement/ClassDetail/Modals/HistoryModal.tsx`
    - `ontap-web/components/ClassManagement/ClassDetail/Modals/index.tsx`
    - `ontap-web/components/ClassManagement/Modals/HistoryModal.tsx`
    - `ontap-web/components/ClassManagement/Modals/index.tsx`
    - `ontap-win/components/ClassDetail/Modals/HistoryModal.tsx`
    - `ontap-win/components/ClassDetail/Modals/index.tsx`
  - **Logic:** Thay `h.isPassed` bằng hàm fallback:
    ```tsx
    // Độ sâu import KHÁC NHAU theo vị trí file — copy sai là lỗi build:
    // ClassDetail/Modals/* (web + win) và ClassManagement/Modals/* (web), sâu 3 cấp: '../../../utils/examUtils'
    // ClassManagement/ClassDetail/Modals/* (web, sâu 4 cấp): '../../../../utils/examUtils'
    import { calculateIsPass } from '../../../utils/examUtils'; // Kiểm tra lại ../ cho đúng file đang sửa!
    // ...
    const isPassed = h.isPassed ?? calculateIsPass(h.score, h.totalQuestions, h.type || 'Ôn tập');
    // Dùng isPassed thay cho h.isPassed trong render
    ```

---

## Bug 2: Không hiện tên học viên ở màn hình kết quả

### 📋 Nguyên nhân gốc

File `ExamResultsScreen.tsx:66` đã render `{userName}` đúng. Vấn đề nằm ở **nơi gọi component** không truyền đúng prop `userName`.

### ✅ Checklist sửa lỗi

- [ ] **Bước 2.1: Sửa lỗi truyền prop `userName` bị rỗng từ gốc**
  - **File sửa:** `ontap-web/routes/AppRoutes.tsx` (nơi duy nhất render các màn kết quả, dùng `userName` từ store) và file tương ứng `ontap-win/routes/AppRoutes.tsx`.
  - **Logic:** Cả 4 màn kết quả đều đã render `{userName}`, nhưng giá trị trong store (`state.userName`, khởi tạo `''`) bị rỗng với khách vãng lai / login thiếu tên. Fix tại nguồn: đồng bộ tên vào store ngay sau đăng nhập.
  - **Code Snippet (vá ngoài component — DÙNG `getState()`, cấm gọi hook ngoài component):**
    ```tsx
    // Tại nơi xử lý sau đăng nhập thành công (auth flow), trước khi vào màn kết quả:
    import { useAppStore } from '../stores/useAppStore';
    // UserProfile KHÔNG có displayName — chỉ có full_name / fullName / email.
    // Lấy userProfile từ store (KHÔNG dùng biến lơ lửng):
    // const userProfile = useAppStore.getState().userProfile;
    const finalUserName = userProfile?.full_name || userProfile?.fullName
      || userProfile?.email?.split('@')[0];
    if (finalUserName) useAppStore.getState().setUserName(finalUserName);
    // Các màn kết quả giữ nguyên userName={userName} từ store (AppRoutes đã truyền đúng).
    // (Kiểm tra trước: useAppInitialization 2 bên đã sync tên ở hầu hết nhánh — chỉ vá nhánh còn thiếu.)
    ```

- [ ] **Bước 2.2: Thêm fallback an toàn vào bên trong 4 Component (Web & Win)**
  - **Các file sửa:** 
    - `ontap-web/components/ExamResultsScreen.tsx`
    - `ontap-web/components/ResultsScreen.tsx`
    - `ontap-win/components/ExamResultsScreen.tsx`
    - `ontap-win/components/ResultsScreen.tsx`
  - **Logic:** Đảm bảo dù `userName` truyền vào là rỗng hay khoảng trắng, UI vẫn không bị lỗi.
  - **Code Snippet:**
    ```tsx
    const displayName = userName?.trim() ? userName : 'Học viên ẩn danh';
    // Trong UI: dùng {displayName} thay cho {userName}
    ```

---

## Test Criteria (Phase 02)

- [ ] Ôn tập 18 câu đúng 18/18 → hiện "ĐẠT" ✅
- [ ] Ôn tập 18 câu đúng 17/18 → hiện "KHÔNG ĐẠT"
- [ ] Thi thử 30 câu đúng 25/30 → hiện "ĐẠT" ✅
- [ ] Thi thử 30 câu đúng 24/30 → hiện "KHÔNG ĐẠT"
- [ ] Thi thử 30 câu đúng 30/30 → hiện "ĐẠT" ✅
- [ ] Lịch sử cũ (không có trường `isPassed`) vẫn tính lại đúng
  *(Lưu ý: HistoryScreen web hiện nhãn "Hoàn thành / Cố gắng lên" chứ không phải "ĐẠT / KHÔNG ĐẠT" — test theo mapping: ĐẠT rule mới ↔ nhãn "Hoàn thành".)*
- [ ] Tên học viên hiển thị đúng ở màn hình kết quả (cả Thi thử lẫn Ôn tập)
- [ ] Nếu user chưa có tên → hiện "Học viên ẩn danh"

---
Next Phase: [Phase 03: Core Features](./phase-03-core-features.md)
