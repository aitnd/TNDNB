import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'

const rootDir = path.resolve(__dirname, '..')

describe('Phase 01: Vietnamese Typography Fix, Portal Sidebar /ontap Link & ontap-web Dual-Theme Core', () => {
  it('Task 1.0 (Part 1): app/layout.tsx đã xóa Rubik, nạp Be_Vietnam_Pro, Merriweather, JetBrains_Mono với subsets vietnamese, và globals.css không còn @import url sai vị trí', () => {
    const layoutContent = fs.readFileSync(path.resolve(rootDir, 'app/layout.tsx'), 'utf8')
    const globalsCss = fs.readFileSync(path.resolve(rootDir, 'app/globals.css'), 'utf8')

    expect(layoutContent).not.toContain('Rubik')
    expect(layoutContent).toContain('Be_Vietnam_Pro')
    expect(layoutContent).toContain('Merriweather')
    expect(layoutContent).toContain('JetBrains_Mono')
    expect(layoutContent).toContain("'latin', 'vietnamese'")

    expect(globalsCss).not.toContain("@import url('https://fonts.googleapis.com")
    expect(globalsCss).toContain("var(--font-sans), 'Be Vietnam Pro'")
  })

  it('Task 1.0 (Part 2): 11 file CSS Module trên Root Portal chuẩn hóa var(--font-sans) cho chữ Tiếng Việt, không còn hardcode Segoe UI hay Arial', () => {
    const navbarCss = fs.readFileSync(path.resolve(rootDir, 'components/Navbar.module.css'), 'utf8')
    const pageCss = fs.readFileSync(path.resolve(rootDir, 'app/page.module.css'), 'utf8')
    const baiVietCss = fs.readFileSync(path.resolve(rootDir, 'app/bai-viet/[postId]/page.module.css'), 'utf8')
    const danhMucCss = fs.readFileSync(path.resolve(rootDir, 'app/danh-muc/[categoryId]/page.module.css'), 'utf8')
    const hocPhiCss = fs.readFileSync(path.resolve(rootDir, 'app/hoc-phi/page.module.css'), 'utf8')
    const quanLyCss = fs.readFileSync(path.resolve(rootDir, 'app/quan-ly/page.module.css'), 'utf8')
    const dangBaiCss = fs.readFileSync(path.resolve(rootDir, 'app/quan-ly/dang-bai/page.module.css'), 'utf8')
    const taiKhoanCss = fs.readFileSync(path.resolve(rootDir, 'app/quan-ly/tai-khoan/page.module.css'), 'utf8')
    const roomIdCss = fs.readFileSync(path.resolve(rootDir, 'app/quan-ly/[roomId]/page.module.css'), 'utf8')
    const traCuuCss = fs.readFileSync(path.resolve(rootDir, 'app/tra-cuu-dia-chi/page.module.css'), 'utf8')
    const studentCardCss = fs.readFileSync(path.resolve(rootDir, 'components/StudentCard.module.css'), 'utf8')

    // Navbar
    expect(navbarCss).not.toContain('font-family: var(--font-mono')
    expect(navbarCss).toContain("font-family: var(--font-sans, 'Be Vietnam Pro'")

    // tra-cuu-dia-chi & StudentCard
    expect(traCuuCss).not.toContain('Segoe UI')
    expect(traCuuCss).toContain("var(--font-sans, 'Be Vietnam Pro'")
    expect(studentCardCss).not.toContain("'Arial'")
    expect(studentCardCss).toContain("var(--font-sans, 'Be Vietnam Pro'")

    // page.module.css
    expect(pageCss).toContain("var(--font-sans, 'Be Vietnam Pro'")

    // bai-viet & danh-muc
    expect(baiVietCss).toContain("var(--font-sans, 'Be Vietnam Pro'")
    expect(danhMucCss).toContain("var(--font-sans, 'Be Vietnam Pro'")

    // hoc-phi: .table th uses sans
    expect(hocPhiCss).toContain("font-family: var(--font-sans, 'Be Vietnam Pro'")

    // quan-ly roleTag, dang-bai, tai-khoan, roomId
    expect(quanLyCss).toContain("font-family: var(--font-sans, 'Be Vietnam Pro'")
    expect(dangBaiCss).toContain("font-family: var(--font-sans, 'Be Vietnam Pro'")
    expect(taiKhoanCss).toContain("font-family: var(--font-sans, 'Be Vietnam Pro'")
    expect(roomIdCss).toContain("font-family: var(--font-sans, 'Be Vietnam Pro'")
  })

  it('Task 1.1: components/Sidebar.tsx chứa liên kết /ontap trong khung Tra cứu & Tiện ích, không rò rỉ sang Navbar hay Footer', () => {
    const sidebarContent = fs.readFileSync(path.resolve(rootDir, 'components/Sidebar.tsx'), 'utf8')
    const navbarContent = fs.readFileSync(path.resolve(rootDir, 'components/Navbar.tsx'), 'utf8')
    const footerContent = fs.readFileSync(path.resolve(rootDir, 'components/Footer.tsx'), 'utf8')

    expect(sidebarContent).toContain('Tra cứu &')
    expect(sidebarContent).toContain('href="/ontap"')
    expect(sidebarContent).toContain('Ôn tập &')

    // Không thêm vào Navbar hay Footer
    expect(navbarContent).not.toContain('href="/ontap"')
    expect(footerContent).not.toContain('href="/ontap"')
  })

  it('Task 1.2 - 1.4: ontap-web chỉ giữ đúng 2 theme light và dark, đã xóa SnowEffect.tsx và sửa vòng lặp --font-sans', () => {
    const typesContent = fs.readFileSync(path.resolve(rootDir, 'ontap-web/types.ts'), 'utf8')
    const themeCtxContent = fs.readFileSync(path.resolve(rootDir, 'ontap-web/contexts/ThemeContext.tsx'), 'utf8')
    const themeCssContent = fs.readFileSync(path.resolve(rootDir, 'ontap-web/theme.css'), 'utf8')
    const indexHtmlContent = fs.readFileSync(path.resolve(rootDir, 'ontap-web/index.html'), 'utf8')
    const iconsContent = fs.readFileSync(path.resolve(rootDir, 'ontap-web/components/icons.tsx'), 'utf8')
    const footerContent = fs.readFileSync(path.resolve(rootDir, 'ontap-web/components/Footer.tsx'), 'utf8')
    const appContent = fs.readFileSync(path.resolve(rootDir, 'ontap-web/App.tsx'), 'utf8')
    const themeSwitcherContent = fs.readFileSync(path.resolve(rootDir, 'ontap-web/components/ThemeSwitcher.tsx'), 'utf8')
    const snowEffectPath = path.resolve(rootDir, 'ontap-web/components/SnowEffect.tsx')

    expect(typesContent).toContain("export type Theme = 'light' | 'dark';")
    expect(themeCtxContent).toContain('toggleTheme')
    expect(fs.existsSync(snowEffectPath)).toBe(false)
    expect(appContent).not.toContain('SnowEffect')

    expect(themeCssContent).not.toContain('--font-sans: var(--font-sans)')
    expect(themeCssContent).toContain("[data-theme='light']")
    expect(themeCssContent).toContain("[data-theme='dark']")
    expect(themeCssContent).not.toContain("[data-theme='noel']")
    expect(themeCssContent).not.toContain("[data-theme='tri-an']")
    expect(themeCssContent).not.toContain("[data-theme='premium']")
    expect(themeCssContent).not.toContain("[data-theme='sunrise']")
    expect(themeCssContent).not.toContain("[data-theme='classic']")
    expect(themeCssContent).not.toContain("[data-theme='modern']")

    expect(indexHtmlContent).not.toContain('Playfair+Display')
    expect(iconsContent).not.toContain("theme === 'noel'")
    expect(iconsContent).not.toContain("theme === 'tri-an'")
    expect(footerContent).not.toContain("theme === 'noel'")
    expect(footerContent).not.toContain("theme === 'tri-an'")

    expect(themeSwitcherContent).toContain('toggleTheme')
  })

  it('ExamQuizScreen.tsx bảo toàn giao diện Desktop và tối ưu thanh Mobile Header siêu gọn', () => {
    const examQuiz = fs.readFileSync(
      path.resolve(rootDir, 'ontap-web/components/ExamQuizScreen.tsx'),
      'utf8'
    );

    // 1. Phải bảo toàn khối Desktop Header đầy đủ thông tin cá nhân và hộp cam
    expect(examQuiz).toContain('hidden md:flex justify-between items-start');
    expect(examQuiz).toContain('Số báo danh');
    expect(examQuiz).toContain('bg-[#f0ad4e]');

    // 2. Phải có thanh Mobile Exam Header siêu gọn gàng
    expect(examQuiz).toContain('flex md:hidden items-center justify-between');
    expect(examQuiz).toContain('handleBackWithConfirm');
    expect(examQuiz).toContain('tabular-nums');
  })
})

describe('Phase 02: App Shell, Split-Window WelcomeModal & Bento 12-Col Dashboard', () => {
  it('Task 2.2: WelcomeModal.tsx áp dụng bố cục thẻ trung tâm tối giản, xóa sạch viền neon, thông số tự bịa và bullet points', () => {
    const welcomeModal = fs.readFileSync(
      path.resolve(rootDir, 'ontap-web/components/WelcomeModal.tsx'),
      'utf8'
    )

    // Đảm bảo không còn hiệu ứng neon blur cũ
    expect(welcomeModal).not.toContain('via-blue-500 to-violet-500')
    expect(welcomeModal).not.toContain('blur-xl')

    // Đảm bảo đã xóa sạch khối thông số tự tạo và bố cục split-window 2 cột cũ
    expect(welcomeModal).not.toContain('Thông số Hệ thống Học liệu')
    expect(welcomeModal).not.toContain('md:col-span-7')
    expect(welcomeModal).not.toContain('md:col-span-5')

    // Đảm bảo đã xóa sạch 3 bullet points tính năng theo phản hồi của người dùng
    expect(welcomeModal).not.toContain('Ôn luyện theo từng môn')
    expect(welcomeModal).not.toContain('Tự động lưu câu hay sai')
    expect(welcomeModal).not.toContain('Hỗ trợ làm bài ngoại tuyến')

    // Xác nhận áp dụng bố cục thẻ đơn tối giản max-w-lg và semantic tokens
    expect(welcomeModal).toContain('max-w-lg')
    expect(welcomeModal).toContain('bg-card')
    expect(welcomeModal).toContain('border-border')
    expect(welcomeModal).toContain('rounded-2xl')
    expect(welcomeModal).toContain('HelmIcon3D')

    // Xác nhận giữ định dạng tabular-nums cho hotline đào tạo
    expect(welcomeModal).toContain('tabular-nums')
  })

  it('Task 2.3 (Widgets): StudentCard, WeatherWidget và AdminStatsBar áp dụng tabular-nums cho dữ liệu số và chuẩn hóa semantic tokens', () => {
    const studentCard = fs.readFileSync(path.resolve(rootDir, 'ontap-web/components/StudentCard.tsx'), 'utf8')
    const weatherWidget = fs.readFileSync(path.resolve(rootDir, 'ontap-web/components/WeatherWidget.tsx'), 'utf8')
    const adminStatsBar = fs.readFileSync(path.resolve(rootDir, 'ontap-web/components/AdminStatsBar.tsx'), 'utf8')

    expect(studentCard).toContain('tabular-nums')
    expect(weatherWidget).toContain('tabular-nums')
    expect(weatherWidget).not.toContain('bg-gray-900/70')
    expect(adminStatsBar).toContain('tabular-nums')
    expect(adminStatsBar).toContain('border-border')
  })

  it('Task 2.4: LoginScreen, RegisterScreen và WindowsLoginScreen chuẩn hóa semantic card và xóa hardcoded colors', () => {
    const loginScreen = fs.readFileSync(path.resolve(rootDir, 'ontap-web/components/LoginScreen.tsx'), 'utf8')
    const registerScreen = fs.readFileSync(path.resolve(rootDir, 'ontap-web/components/RegisterScreen.tsx'), 'utf8')
    const windowsLogin = fs.readFileSync(path.resolve(rootDir, 'ontap-web/components/WindowsLoginScreen.tsx'), 'utf8')

    expect(loginScreen).toContain('border-border')
    expect(registerScreen).toContain('border-border')
    expect(windowsLogin).toContain('bg-card')
    expect(windowsLogin).toContain('border-border')
    expect(windowsLogin).not.toContain('bg-gray-100')
    expect(windowsLogin).not.toContain('bg-blue-500')
  })
})

describe('Phase 03: Learning Flow, Dual-Theme QuizScreen & 100% Protected ExamQuizScreen', () => {
  it('Task 3.1 & 3.3: LicenseSelectionScreen.tsx và QuizScreen.tsx áp dụng chuẩn Dual-Theme semantic tokens + tabular-nums, xóa sạch bg-gray-50/border-gray-200 cứng', () => {
    const licenseScreen = fs.readFileSync(
      path.resolve(rootDir, 'ontap-web/components/LicenseSelectionScreen.tsx'),
      'utf8'
    )
    const quizScreen = fs.readFileSync(
      path.resolve(rootDir, 'ontap-web/components/QuizScreen.tsx'),
      'utf8'
    )
    const resultsScreen = fs.readFileSync(
      path.resolve(rootDir, 'ontap-web/components/ResultsScreen.tsx'),
      'utf8'
    )

    expect(licenseScreen).toContain('tabular-nums')
    expect(licenseScreen).not.toContain('rounded-[2.5rem]')

    expect(quizScreen).toContain('tabular-nums')
    expect(quizScreen).not.toContain('bg-gray-50')
    expect(quizScreen).not.toContain('border-gray-200')
    expect(quizScreen).not.toContain('bg-primary/10 border-primary ring-2 ring-primary text-primary-foreground')

    expect(resultsScreen).toContain('tabular-nums')
  })

  it('Task 3.4: ExamQuizScreen.tsx duy trì tính ổn định của đồng hồ đếm ngược với tabular-nums', () => {
    const examQuiz = fs.readFileSync(
      path.resolve(rootDir, 'ontap-web/components/ExamQuizScreen.tsx'),
      'utf8'
    );

    expect(examQuiz).toContain('tabular-nums');
    expect(examQuiz).toContain('formatTime(timeLeft)');
  })
})

describe('Phase 04: Management, Student/Admin Portals & Utility Screens Dual-Theme Audit', () => {
  it('Tasks 4.1 - 4.3: Toàn bộ ontap-web/components sạch 100% 6 theme cũ và các bảng quản lý bật tabular-nums', () => {
    const componentsDir = path.resolve(rootDir, 'ontap-web/components')
    const files = fs.readdirSync(componentsDir).filter((f) => f.endsWith('.tsx'))

    for (const file of files) {
      const content = fs.readFileSync(path.join(componentsDir, file), 'utf8')
      expect(content).not.toContain("theme === 'noel'")
      expect(content).not.toContain("theme === 'tri-an'")
      expect(content).not.toContain("theme === 'premium'")
      expect(content).not.toContain("theme === 'sunrise'")
      expect(content).not.toContain("theme === 'classic'")
      expect(content).not.toContain("theme === 'modern'")
    }

    const historyScreen = fs.readFileSync(path.join(componentsDir, 'HistoryScreen.tsx'), 'utf8')
    const classMgmtScreen = fs.readFileSync(path.join(componentsDir, 'ClassManagementScreen.tsx'), 'utf8')
    expect(historyScreen).toContain('tabular-nums')
    expect(classMgmtScreen).toContain('tabular-nums')
  })
})

describe('ExamQuizScreen Dark Mode Color Contrast (WCAG 2.1 AA)', () => {
  it('TC-35: ExamQuizScreen.tsx chuẩn hóa Semantic Tokens và độ tương phản Dark Mode (WCAG 2.1 AA)', () => {
    const examQuiz = fs.readFileSync(
      path.resolve(rootDir, 'ontap-web/components/ExamQuizScreen.tsx'),
      'utf8'
    )

    // 1. Wrapper container không còn hardcode text-black, chuyển sang text-foreground
    expect(examQuiz).not.toMatch(/className="[^"]*max-w-7xl[^"]*text-black/)
    expect(examQuiz).toMatch(/className="[^"]*max-w-7xl[^"]*text-foreground/)

    // 2. Tên học viên và số câu hỏi hỗ trợ dark:text-sky-400 và dark:text-red-400
    expect(examQuiz).toContain('dark:text-sky-400')
    expect(examQuiz).toContain('dark:text-red-400')

    // 3. Nội dung câu hỏi có class text-foreground rõ ràng
    expect(examQuiz).toMatch(/<p\s+className="[^"]*text-foreground[^"]*"[^>]*>\s*\{currentQuestion\.text\}/)

    // 4. Vòng tròn đáp án chưa chọn không được dùng cặp mờ lóa bg-gray-200 text-foreground
    expect(examQuiz).not.toContain('bg-gray-200 text-foreground')
    expect(examQuiz).toContain('dark:bg-slate-800')

    // 5. SquareCheckbox tick không được dùng bg-[#333] mà dùng dark:bg-sky-400
    expect(examQuiz).not.toMatch(/SquareCheckbox[\s\S]*?bg-\[#333\]/)
    expect(examQuiz).toContain('dark:bg-sky-400')

    // 6. Nút Câu trước hỗ trợ dark mode không hardcode bg-gray-100 text-black
    expect(examQuiz).not.toMatch(/Câu trước[\s\S]*?bg-gray-100\s+text-black|bg-gray-100\s+text-black[\s\S]*?Câu trước/)
    expect(examQuiz).toContain('bg-secondary')

    // 7. Answer Sheet trong ontap-web/components/ExamQuizScreen.tsx hỗ trợ Dark Mode
    expect(examQuiz).toContain('dark:bg-sky-950/60')
    expect(examQuiz).toContain('dark:text-sky-300')
    expect(examQuiz).not.toContain('bg-cyan-200')

    // 8. Nút chính Dark Mode đạt độ tương phản cao (bg-sky-500 + text-slate-950)
    expect(examQuiz).toContain('dark:bg-sky-500')
    expect(examQuiz).toContain('dark:text-slate-950')
    expect(examQuiz).not.toContain('dark:bg-sky-600 text-primary-foreground dark:text-white')

    // 9. Đồng bộ ontap-win/components/ExamQuizScreen.tsx với Tailwind v3.4 & Dark Mode tokens
    const examQuizWin = fs.readFileSync(
      path.resolve(rootDir, 'ontap-win/components/ExamQuizScreen.tsx'),
      'utf8'
    )
    expect(examQuizWin).not.toContain('bg-[#333]')
    expect(examQuizWin).not.toContain('bg-cyan-200')
    expect(examQuizWin).not.toContain('rounded-xs')
    expect(examQuizWin).not.toContain('shadow-xs')
    expect(examQuizWin).not.toMatch(/className="[^"]*max-w-7xl[^"]*text-black/)
    expect(examQuizWin).toMatch(/className="[^"]*max-w-7xl[^"]*text-foreground/)
    expect(examQuizWin).toContain('dark:bg-sky-400')
    expect(examQuizWin).toContain('dark:bg-sky-950/60')
    expect(examQuizWin).toContain('dark:bg-sky-500')
    expect(examQuizWin).toContain('dark:text-slate-950')
    expect(examQuizWin).not.toContain('dark:bg-sky-600 text-primary-foreground dark:text-white')

    // 10. ontap-win/tailwind.config.js cấu hình darkMode hỗ trợ [data-theme="dark"]
    const winTailwindConfig = fs.readFileSync(
      path.resolve(rootDir, 'ontap-win/tailwind.config.js'),
      'utf8'
    )
    expect(winTailwindConfig).toContain('darkMode')
    expect(winTailwindConfig).toContain('[data-theme="dark"]')
  })
})

describe('Phase 05: ThemeSwitcher in Hamburger Menu & Default Light Per-Session (Plan 261112-2215)', () => {
  it('TC-37: Mặc định tất cả phiên mới là Theme Sáng (sessionStorage + bỏ prefers-color-scheme + dọn localStorage cũ + chịu lỗi SecurityError)', async () => {
    const themeCtxPath = path.resolve(rootDir, 'ontap-web/contexts/ThemeContext.tsx')
    const themeCtxContent = fs.readFileSync(themeCtxPath, 'utf8')
    const indexHtmlContent = fs.readFileSync(path.resolve(rootDir, 'ontap-web/index.html'), 'utf8')

    // 1. HTML gốc luôn đặt data-theme="light"
    expect(indexHtmlContent).toContain('data-theme="light"')

    // 2. ThemeContext không còn đọc prefers-color-scheme: dark và dùng sessionStorage key ontap_theme_session
    expect(themeCtxContent).not.toContain('prefers-color-scheme')
    expect(themeCtxContent).not.toMatch(/localStorage\.getItem\(['"]ontap_theme['"]\)/)
    expect(themeCtxContent).not.toMatch(/localStorage\.getItem\(['"]theme['"]\)/)
    expect(themeCtxContent).toContain('ontap_theme_session')
    expect(themeCtxContent).toContain('sessionStorage')
    expect(themeCtxContent).toMatch(/localStorage\.removeItem\(['"]ontap_theme['"]\)/)
    expect(themeCtxContent).toMatch(/localStorage\.removeItem\(['"]theme['"]\)/)
    expect(themeCtxContent).toContain('toggleTheme')

    // 3. Kiểm thử hành vi runtime cho Review Focus #1 (SecurityError) & #2 (localStorage cũ còn lưu dark)
    const mod = await import('../ontap-web/contexts/ThemeContext')
    expect(typeof mod.getInitialTheme).toBe('function')
    expect(typeof mod.clearLegacyThemeStorage).toBe('function')

    // Phiên mới (sessionStorage trống) -> luôn là 'light'
    const emptySession = { getItem: () => null }
    expect(mod.getInitialTheme(emptySession)).toBe('light')

    // Cùng phiên đã chọn 'dark' -> giữ 'dark' khi F5
    const darkSession = { getItem: (k: string) => (k === 'ontap_theme_session' ? 'dark' : null) }
    expect(mod.getInitialTheme(darkSession)).toBe('dark')

    // Giá trị lạ hoặc hỏng -> fallback 'light'
    const invalidSession = { getItem: () => 'noel' }
    expect(mod.getInitialTheme(invalidSession)).toBe('light')

    // Review Focus #1: sessionStorage ném SecurityError trong iframe/private mode -> không crash, trả về 'light'
    const throwingSession = {
      getItem: () => {
        throw new Error('SecurityError: Failed to read sessionStorage')
      },
    }
    expect(mod.getInitialTheme(throwingSession)).toBe('light')

    // Review Focus #2: clearLegacyThemeStorage xóa sạch cả ontap_theme và theme, chịu được SecurityError
    const removedKeys: string[] = []
    mod.clearLegacyThemeStorage({
      removeItem: (k: string) => {
        removedKeys.push(k)
      },
    })
    expect(removedKeys).toEqual(['ontap_theme', 'theme'])

    expect(() =>
      mod.clearLegacyThemeStorage({
        removeItem: () => {
          throw new Error('SecurityError')
        },
      })
    ).not.toThrow()
  })

  it('TC-36: Di chuyển ThemeSwitcher vào menu 3 gạch góc trên phải (TopNavbar & MobileBottomNav) và gỡ bỏ hoàn toàn nút nổi góc dưới phải ở App.tsx', () => {
    const appContent = fs.readFileSync(path.resolve(rootDir, 'ontap-web/App.tsx'), 'utf8')
    const themeSwitcherContent = fs.readFileSync(path.resolve(rootDir, 'ontap-web/components/ThemeSwitcher.tsx'), 'utf8')
    const topNavbarContent = fs.readFileSync(path.resolve(rootDir, 'ontap-web/components/TopNavbar.tsx'), 'utf8')
    const mobileBottomNavContent = fs.readFileSync(path.resolve(rootDir, 'ontap-web/components/MobileBottomNav.tsx'), 'utf8')
    const footerContent = fs.readFileSync(path.resolve(rootDir, 'ontap-web/components/Footer.tsx'), 'utf8')

    // 1. App.tsx: xóa sạch import ThemeSwitcher (Review Focus #3: noUnusedLocals) và gỡ khối fixed bottom-4 right-4
    expect(appContent).not.toContain('ThemeSwitcher')
    expect(appContent).not.toContain('fixed bottom-4 right-4')

    // 2. ThemeSwitcher.tsx: hỗ trợ variant?: 'icon' | 'menu-item' (mặc định 'icon' cho Footer.tsx), có role="switch", aria-checked, min-h-[44px], focus-visible:ring-2
    expect(themeSwitcherContent).toContain("variant?: 'icon' | 'menu-item'")
    expect(themeSwitcherContent).toContain("variant = 'icon'")
    expect(themeSwitcherContent).toContain('role="switch"')
    expect(themeSwitcherContent).toContain('aria-checked={isDark}')
    expect(themeSwitcherContent).toContain('min-h-[44px]')
    expect(themeSwitcherContent).toContain('focus-visible:ring-2')
    expect(themeSwitcherContent).toContain('toggleTheme')
    expect(footerContent).toContain('<ThemeSwitcher />')

    // 3. TopNavbar.tsx: nhúng <ThemeSwitcher variant="menu-item" /> bên trong dropdown showHamburgerMenu cho cả khách và thành viên (Review Focus #4)
    expect(topNavbarContent).toMatch(/import\s+ThemeSwitcher\s+from\s+['"]\.\/ThemeSwitcher['"]/)
    const hamburgerBlockMatch = topNavbarContent.match(/\{showHamburgerMenu\s*&&\s*\([\s\S]*?<ThemeSwitcher\s+variant=['"]menu-item['"]\s*\/>[\s\S]*?\)\}/)
    expect(hamburgerBlockMatch).toBeTruthy()
    expect(topNavbarContent).toContain('aria-expanded={showHamburgerMenu}')

    // 4. MobileBottomNav.tsx: nhúng <ThemeSwitcher variant="menu-item" /> bên trong menu mở rộng cho cả khách và thành viên (Review Focus #4)
    expect(mobileBottomNavContent).toMatch(/import\s+ThemeSwitcher\s+from\s+['"]\.\/ThemeSwitcher['"]/)
    expect(mobileBottomNavContent).toMatch(/<ThemeSwitcher\s+variant=['"]menu-item['"]\s*\/>/)
    // Đảm bảo ThemeSwitcher nằm ngoài nhánh chỉ dành cho userProfile để khách (!userProfile) vẫn bấm được
    const beforeGuestLoginBtn = mobileBottomNavContent.split('Đăng nhập ngay')[0]
    expect(beforeGuestLoginBtn).toContain('variant="menu-item"')
  })
})
