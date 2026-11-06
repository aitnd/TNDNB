# Chi Tiết Kỹ Thuật Phase 01: Cơ Chế Lưu Kép Dual-Storage & Fallback An Toàn (KV + Firestore)

> **Mã kế hoạch**: `261107-0025-fix-settings-save-and-private-repo-errors`  
> **Tài liệu tham chiếu**:
> - Kế hoạch tổng thể: [`plan.md`](file:///d:/Antigravity/TNDNB/docs/plans/261107-0025-fix-settings-save-and-private-repo-errors/plan.md)
> - Danh sách nhiệm vụ: [`task.md`](file:///d:/Antigravity/TNDNB/docs/plans/261107-0025-fix-settings-save-and-private-repo-errors/task.md)
> - Tệp mã nguồn mục tiêu: [`ontap-web/services/adminConfigService.ts`](file:///d:/Antigravity/TNDNB/ontap-web/services/adminConfigService.ts)

---

## 1. Mục Tiêu Kỹ Thuật

1. **Xóa bỏ hoàn toàn điểm lỗi đơn lẻ (Single Point of Failure)** trong quá trình lưu và đọc cấu hình hệ thống tại trang `/ontap/settings`.
2. **Thiết lập kiến trúc lưu kép Hybrid Cloud (Dual-Storage Architecture)**:
   - **Tầng 1 (Edge KV)**: Cloudflare Workers KV (`api.daotaothuyenvien.com`) phục vụ truy xuất với độ trễ thấp ở rìa mạng.
   - **Tầng 2 (Central DB & Resilient Fallback)**: Firebase Firestore (`settings/usage_config` và `settings/github_config`) là nguồn lưu trữ trung tâm ổn định tuyệt đối.
   - **Tầng 3 (Client Cache)**: Trình duyệt `localStorage` và bộ nhớ RAM `DEFAULT_CONFIG`.
3. **Bảo đảm trải nghiệm người dùng luôn mượt mà**:
   - Khi Quản trị viên bấm **"Lưu Thay Đổi"**, chỉ cần **lưu thành công vào ít nhất một kênh (đặc biệt là Firestore)**, hệ thống sẽ coi là THÀNH CÔNG, hiển thị **Popup XANH của SweetAlert2**, và cập nhật ngay vào bộ nhớ đệm.
   - Nếu Cloudflare KV gặp sự cố (401 do chưa deploy token mới, 404, nghẽn mạng), hệ thống tự động ghi nhận cảnh báo ngầm (warning log) mà không làm gián đoạn luồng làm việc của Quản trị viên.

---

## 2. Phân Tích Thực Trạng & Điểm Lỗi Cốt Lõi

Trước đây, trong tệp [`ontap-web/services/adminConfigService.ts`](file:///d:/Antigravity/TNDNB/ontap-web/services/adminConfigService.ts), quy tắc cũ đã áp dụng nguyên tắc cực đoan:
> *"Ruling 2.3: Cloudflare KV 100% Single Source of Truth — NO Firestore fallback"*

Hậu quả:
- Hàm `saveUsageConfig` chỉ gọi duy nhất `saveD1Config()` lên Cloudflare Worker.
- Khi Worker trả về mã lỗi 401 (do Worker production trên Edge chưa deploy mã xác thực mới), biến `ok === false`.
- Khối mã lập tức ném ra ngoại lệ:
  `throw new Error('Không thể lưu cấu hình lên Cloudflare KV API. Vui lòng kiểm tra kết nối mạng và quyền quản trị.')`
- Tại component [`UsageConfigPanel.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/UsageConfigPanel.tsx):
  ```typescript
  try {
      await saveUsageConfig(config);
      Swal.fire({ title: 'Thành công!', icon: 'success' });
  } catch (error) {
      Swal.fire('Lỗi', 'Không thể lưu cấu hình', 'error'); // <- POPUP ĐỎ XUẤT HIỆN Ở ĐÂY
  }
  ```
- Tương tự, hàm `saveGitHubConfig` cũng bị lỗi tương tự khi lưu token GitHub.

---

## 3. Thiết Kế Kiến Trúc Mới: Dual-Storage & Graceful Fallback

```mermaid
flowchart TD
    subgraph SaveFlow ["Quy Trình Lưu Cấu Hình (saveUsageConfig / saveGitHubConfig)"]
        StartSave["Quản trị viên bấm 'Lưu Thay Đổi'"] --> StepKV["1. Thử ghi Cloudflare KV (Timeout 2.5s)"]
        StepKV -->|Thành công| MarkKVOk["Đánh dấu KV: SUCCESS"]
        StepKV -->|Thất bại 401/404/Err| MarkKVFail["Đánh dấu KV: FAILED (Log warning ngầm)"]

        MarkKVOk & MarkKVFail --> StepFS["2. Luôn ghi Firebase Firestore (doc: settings)"]
        StepFS -->|Thành công| MarkFSOk["Đánh dấu FS: SUCCESS"]
        StepFS -->|Thất bại| MarkFSFail["Đánh dấu FS: FAILED"]

        MarkFSOk --> EvalCheck{"Ít nhất 1 kênh thành công?<br/>(isKvOk || isFsOk)"}
        MarkFSFail --> EvalCheck

        EvalCheck -->|ĐÚNG (Đặc biệt FS thành công)| SuccessResult["Cập nhật localStorage Cache<br/>-> Hoàn tất thành công (Resolve)<br/>-> SweetAlert2 hiện Popup XANH ✅"]
        EvalCheck -->|SAI (Cả 2 đều hỏng)| FailResult["Ném Error cảnh báo lỗi mạng<br/>-> SweetAlert2 hiện Popup ĐỎ ❌"]
    end
```

```mermaid
flowchart TD
    subgraph ReadFlow ["Quy Trình Đọc Cấu Hình (getUsageConfig / getGitHubConfig)"]
        StartRead["Khởi động trang Settings hoặc tải App"] --> TryKV["1. Đọc từ Cloudflare KV"]
        TryKV -->|Có dữ liệu hợp lệ| UseKV["Lấy dữ liệu từ KV"]
        TryKV -->|Rỗng hoặc Lỗi (404/Err)| TryFS["2. Fallback đọc từ Firebase Firestore"]
        
        TryFS -->|Có dữ liệu| UseFS["Lấy dữ liệu từ Firestore"]
        TryFS -->|Rỗng hoặc Lỗi| TryCache["3. Fallback đọc từ localStorage"]

        TryCache -->|Có cache| UseCache["Lấy dữ liệu từ localStorage"]
        TryCache -->|Không có cache| UseDefault["4. Sử dụng DEFAULT_CONFIG"]

        UseKV & UseFS & UseCache & UseDefault --> MergeData["Deep Merge với cấu hình mặc định<br/>Cập nhật lại localStorage<br/>Trả về kết quả chuẩn xác"]
    end
```

---

## 4. Chi Tiết Cài Đặt Mã Nguồn Trong `adminConfigService.ts`

### 4.1. Cập nhật hàm `getUsageConfig`
```typescript
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebaseClient';

export const getUsageConfig = async (): Promise<UsageConfig> => {
    try {
        let data: Partial<UsageConfig> | null = null;

        // 1. Ưu tiên đọc từ Cloudflare KV
        try {
            data = await fetchD1Config<Partial<UsageConfig>>(USAGE_CONFIG_DOC_ID);
        } catch (e) {
            console.warn('[Config] KV fetch skipped, falling back to Firestore:', e);
        }

        // 2. Fallback sang Firestore nếu KV không có dữ liệu
        if (!data) {
            try {
                if (db) {
                    const snap = await getDoc(doc(db, SETTINGS_COLLECTION, USAGE_CONFIG_DOC_ID));
                    if (snap.exists()) {
                        data = snap.data() as Partial<UsageConfig>;
                    }
                }
            } catch (fsErr) {
                console.warn('[Config] Firestore fetch error:', fsErr);
            }
        }

        // 3. Fallback sang localStorage nếu Firestore cũng không có
        if (!data && typeof localStorage !== 'undefined') {
            try {
                const cachedRaw = localStorage.getItem(USAGE_CONFIG_CACHE_KEY);
                if (cachedRaw) {
                    data = JSON.parse(cachedRaw) as Partial<UsageConfig>;
                }
            } catch {}
        }

        // 4. Nếu có dữ liệu, lưu cache và deep merge
        if (data) {
            try {
                if (typeof localStorage !== 'undefined') {
                    localStorage.setItem(USAGE_CONFIG_CACHE_KEY, JSON.stringify(data));
                }
            } catch {}

            return {
                ...DEFAULT_CONFIG,
                guest: { ...DEFAULT_CONFIG.guest, ...(data.guest || {}) },
                free_user: { ...DEFAULT_CONFIG.free_user, ...(data.free_user || {}) },
                verified_user: { ...DEFAULT_CONFIG.verified_user, ...(data.verified_user || {}) },
                vip_user: { ...DEFAULT_CONFIG.vip_user, ...(data.vip_user || {}) },
                teacher: { ...DEFAULT_CONFIG.teacher, ...(data.teacher || {}) },
                manager: { ...DEFAULT_CONFIG.manager, ...(data.manager || {}) },
                leader: { ...DEFAULT_CONFIG.leader, ...(data.leader || {}) },
                admin: { ...DEFAULT_CONFIG.admin, ...(data.admin || {}) },
                app_links: data.app_links || DEFAULT_CONFIG.app_links,
                showPortalAds: data.showPortalAds ?? true,
                showPortalAdSense: data.showPortalAdSense ?? true,
                showPortalAdsterra: data.showPortalAdsterra ?? true,
                showPortalMonetag: data.showPortalMonetag ?? false,
                monetagDirectLinkUrl: data.monetagDirectLinkUrl || '',
                isMaintenanceMode: data.isMaintenanceMode || false,
                isMaintenancePortal: data.isMaintenancePortal ?? (data.isMaintenanceMode || false),
                isMaintenanceWeb: data.isMaintenanceWeb ?? (data.isMaintenanceMode || false),
                isMaintenanceWin: data.isMaintenanceWin ?? (data.isMaintenanceMode || false),
                maintenanceMessage: data.maintenanceMessage || 'Hệ thống đang được bảo trì để nâng cấp. Vui lòng quay lại sau ít phút!',
                maintenanceEstimatedTime: data.maintenanceEstimatedTime || '',
                maintenanceEndTime: data.maintenanceEndTime || '',
                maintenanceSafetyInfo: data.maintenanceSafetyInfo || '',
                maintenanceContact: data.maintenanceContact || '',
                adsenseMaxClicks: data.adsenseMaxClicks ?? 1,
                adsenseCooldownMinutes: data.adsenseCooldownMinutes ?? 30,
                monetagPopunderCooldownMinutes: data.monetagPopunderCooldownMinutes ?? 30,
                monetagDirectLinkCooldownMinutes: data.monetagDirectLinkCooldownMinutes ?? 30,
                monetagDirectLinkMaxPerSession: data.monetagDirectLinkMaxPerSession ?? 0,
                monetagPopunderMaxPerSession: data.monetagPopunderMaxPerSession ?? 0,
                monetagCountdownMaxPerSession: data.monetagCountdownMaxPerSession ?? 0
            };
        }

        return DEFAULT_CONFIG;
    } catch (error) {
        console.error('Error fetching usage config:', error);
        return DEFAULT_CONFIG;
    }
};
```

### 4.2. Cập nhật hàm `saveUsageConfig`
```typescript
export const saveUsageConfig = async (config: UsageConfig): Promise<void> => {
    let kvSuccess = false;
    let firestoreSuccess = false;
    let kvError: any = null;
    let fsError: any = null;

    // 1. Thử lưu lên Cloudflare KV
    try {
        const token = await auth?.currentUser?.getIdToken().catch(() => undefined);
        kvSuccess = await saveD1Config(USAGE_CONFIG_DOC_ID, config, token);
    } catch (err) {
        kvError = err;
        console.warn('[Config] Save to Cloudflare KV failed (will rely on Firestore):', err);
    }

    // 2. Luôn lưu dự phòng lên Firebase Firestore
    try {
        if (db) {
            await setDoc(doc(db, SETTINGS_COLLECTION, USAGE_CONFIG_DOC_ID), config, { merge: true });
            firestoreSuccess = true;
        }
    } catch (err) {
        fsError = err;
        console.error('[Config] Save to Firestore failed:', err);
    }

    // 3. Nếu ít nhất 1 kênh thành công (hoặc Firestore thành công) -> Đạt yêu cầu!
    if (kvSuccess || firestoreSuccess) {
        try {
            if (typeof localStorage !== 'undefined') {
                localStorage.setItem(USAGE_CONFIG_CACHE_KEY, JSON.stringify(config));
            }
        } catch {}
        return; // Thành công mượt mà!
    }

    // 4. Chỉ ném lỗi khi cả 2 kênh đều thất bại
    console.error('All storage channels failed:', { kvError, fsError });
    throw new Error('Không thể lưu cấu hình vào hệ thống. Vui lòng kiểm tra kết nối mạng và quyền quản trị.');
};
```

### 4.3. Cập nhật tương tự cho `getGitHubConfig` và `saveGitHubConfig`
- Áp dụng cấu trúc lưu kép tương tự với document `settings/github_config`.

---

## 5. Kế Hoạch Kiểm Thử TDD Cho Phase 01

- [ ] **Task 1.1**: Viết test case `TC-12`: `saveUsageConfig` thành công khi Firestore hoạt động ngay cả khi `saveD1Config` trả về `false`.
- [ ] **Task 1.2**: Viết test case `TC-13`: `getUsageConfig` fallback đọc Firestore khi KV trả về `null`.
- [ ] **Task 1.3**: Triển khai mã nguồn mới trong [`adminConfigService.ts`](file:///d:/Antigravity/TNDNB/ontap-web/services/adminConfigService.ts).
- [ ] **Task 1.4**: Chạy Vitest xác nhận các bài kiểm thử chuyển sang màu **GREEN (PASS)**.
