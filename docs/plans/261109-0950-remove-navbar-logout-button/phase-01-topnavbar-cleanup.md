# Phase 01: Dọn dẹp nút "Thoát" độc lập trên thanh TopNavbar

> **Thuộc kế hoạch:** [`plan.md`](file:///d:/Antigravity/TNDNB/docs/plans/261109-0950-remove-navbar-logout-button/plan.md)  
> **Tài liệu thiết kế:** [`DESIGN.md`](file:///d:/Antigravity/TNDNB/docs/plans/261109-0950-remove-navbar-logout-button/DESIGN.md)  
> **Status:** ⬜ Pending  
> **Dependencies:** None

**Goal:** Loại bỏ vách ngăn dọc và nút `Thoát` màu đỏ nằm lộ thiên ngoài thanh điều hướng Desktop trên [`ontap-web/components/TopNavbar.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/TopNavbar.tsx), giữ nguyên vẹn 100% nút `Đăng xuất` bên trong Hamburger Menu 3 gạch (`showHamburgerMenu`).

**Architecture:** Giữ nguyên contract props `TopNavbarProps` (`userProfile`, `onNavigate`, `onLogout`), dọn sạch khối JSX dư thừa ở bên phải thanh TopNavbar ngoài Desktop để tránh trùng lặp thao tác với menu 3 gạch.

**Tech Stack:** React 19, Tailwind CSS v4, Lucide React, Vitest.

---

## Global Constraints
- Bảo toàn tuyệt đối 100% tệp [`ontap-web/components/ExamQuizScreen.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/ExamQuizScreen.tsx) (`0 bytes diff`).
- Giữ nguyên câu lệnh `import { LogOut } from 'lucide-react'` tại dòng 3 của [`TopNavbar.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/TopNavbar.tsx) vì icon `LogOut` vẫn được dùng bên trong Hamburger Menu (dòng 366).
- Nút `Đăng xuất` bên trong Hamburger Menu (`showHamburgerMenu`) phải đóng menu và gọi `onLogout()`: `onClick={() => { setShowHamburgerMenu(false); onLogout(); }}`.

## Review Focus
1. Người dùng bấm vào nút mở Hamburger Menu 3 gạch (`[≡]`) có bị che khuất hay giật layout không? (Bố cục flex giữ nguyên độ cao `h-16`).
2. Nút `Đăng xuất` trong Hamburger Menu có hoạt động chính xác khi click cả trên Desktop và Mobile không? (Menu dropdown cố định `fixed right-3 top-16 w-72`).
3. Khách chưa đăng nhập (`userProfile === null`) có bị ảnh hưởng không? (Nút `Đăng nhập` của khách giữ nguyên 100%).
4. Tên người dùng và huy hiệu vai trò (`MiniRoleBadge`) có hiển thị đầy đủ không? (Giữ nguyên component `User Account Button`).
5. Không tạo ra bất kỳ lỗi TypeScript hay cảnh báo unused variable nào.

---

## Implementation Steps (TDD Enriched)

### Task 1: Loại bỏ Standalone Logout Button trên Desktop TopNavbar

**Files:**
- Modify: [`ontap-web/components/TopNavbar.tsx:210-230`](file:///d:/Antigravity/TNDNB/ontap-web/components/TopNavbar.tsx)
- Test: [`scripts/portal-console-and-tinymce-fix.test.ts`](file:///d:/Antigravity/TNDNB/scripts/portal-console-and-tinymce-fix.test.ts)

**Interfaces:**
- Consumes: `TopNavbarProps { userProfile: UserProfile | null; onNavigate: (screen: string) => void; onLogout: () => void; }`
- Produces: TopNavbar JSX không còn nút `Thoát` ngoài thanh bar, giữ nguyên nút `Đăng xuất` trong Hamburger Menu.

- [ ] **Step 1.1: Viết test thất bại (RED)**
  Mở [`scripts/portal-console-and-tinymce-fix.test.ts`](file:///d:/Antigravity/TNDNB/scripts/portal-console-and-tinymce-fix.test.ts) và bổ sung test case `TC-32` vào cuối suite:
  ```typescript
  describe('Navbar Logout Cleanup & AdSense Role Gating Fix (Plan 261109-0950)', () => {
    it('TC-32: ontap-web/components/TopNavbar.tsx must NOT render standalone desktop "Thoát" button outside Hamburger Menu', () => {
      const filePath = path.resolve(rootDir, 'ontap-web/components/TopNavbar.tsx');
      const content = fs.readFileSync(filePath, 'utf8');

      // 1. Không còn comment hay khối Standalone Logout Button (Desktop)
      expect(content).not.toContain('Standalone Logout Button (Desktop)');

      // 2. Không còn nhãn <span>Thoát</span> ngoài thanh bar
      expect(content).not.toMatch(/<span[^>]*>\s*Thoát\s*<\/span>/);

      // 3. Phải bảo toàn nút Đăng xuất bên trong Hamburger Menu
      expect(content).toMatch(/setShowHamburgerMenu\(false\);\s*onLogout\(\);/);
      expect(content).toMatch(/<span>\s*Đăng xuất\s*<\/span>/);
    });
  });
  ```

- [ ] **Step 1.2: Chạy test — xác nhận FAIL**
  ```powershell
  npx vitest run scripts/portal-console-and-tinymce-fix.test.ts -t "TC-32"
  ```
  Expected: FAIL vì `TopNavbar.tsx` hiện tại vẫn còn chứa dòng chữ `'Standalone Logout Button (Desktop)'` và `<span className="font-bold text-sm">Thoát</span>`.

- [ ] **Step 1.3: Implement tối thiểu (GREEN)**
  Mở [`ontap-web/components/TopNavbar.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/TopNavbar.tsx), tại khu vực `RIGHT: User Info & Logout`, xóa bỏ hoàn toàn vách ngăn dọc và nút `Thoát` độc lập từ dòng 215 đến 225:
  ```diff
                              {/* User Account Button (Desktop) */}
                              <button 
                                  onClick={() => onNavigate('account')}
                                  className="hidden md:flex flex-col items-end justify-center hover:opacity-85 transition-opacity text-right cursor-pointer"
                                  title="Quản lý tài khoản"
                              >
                                  <span className="text-[11px] text-muted-foreground leading-tight">Xin chào,</span>
                                  <span className="text-sm font-bold text-foreground max-w-[150px] truncate leading-tight mt-0.5">
                                      <span className={`flex items-center gap-1 font-bold ${
                                          userProfile?.role === 'giao_vien' ? 'text-amber-600 dark:text-amber-400' :
                                          userProfile?.role === 'quan_ly' || userProfile?.role === 'lanh_dao' ? 'text-rose-600 dark:text-rose-400' :
                                          userProfile?.role === 'admin' ? 'text-purple-600 dark:text-purple-400' :
                                          'text-primary'
                                      }`}>
                                          {userProfile.full_name || userProfile.fullName || '---'}
                                          {userProfile?.role === 'hoc_vien' && (userProfile.isVerified || userProfile.courseId) && <CheckCircle size={14} className="text-emerald-500" />}
                                          {userProfile?.role && <MiniRoleBadge role={userProfile.role} className="ml-1" />}
                                      </span>
                                  </span>
                              </button>
  -
  -                            <div className="h-6 w-[1px] bg-border mx-1 hidden md:block"></div>
  -
  -                            {/* Standalone Logout Button (Desktop) */}
  -                            <button
  -                                onClick={onLogout}
  -                                className="group hidden md:flex items-center gap-2 text-destructive bg-destructive/10 hover:bg-destructive/15 px-3 py-2 rounded-xl transition-all border border-destructive/20 min-h-[40px]"
  -                                title="Đăng xuất"
  -                            >
  -                                <LogOut size={17} className="group-hover:translate-x-0.5 transition-transform" />
  -                                <span className="font-bold text-sm">Thoát</span>
  -                            </button>
                          </>
                      ) : (
  ```

- [ ] **Step 1.4: Chạy test — xác nhận PASS**
  ```powershell
  npx vitest run scripts/portal-console-and-tinymce-fix.test.ts -t "TC-32"
  ```
  Expected: PASS 1/1 test.

- [ ] **Step 1.5: Kiểm tra Invariants & Commit**
  ```powershell
  git diff ontap-web/components/ExamQuizScreen.tsx
  git add ontap-web/components/TopNavbar.tsx scripts/portal-console-and-tinymce-fix.test.ts
  git commit -m "feat(topnavbar): remove standalone desktop logout button and keep hamburger logout"
  ```
  Expected: Diff của `ExamQuizScreen.tsx` bằng 0 bytes; commit thành công trên nhánh hiện tại.
