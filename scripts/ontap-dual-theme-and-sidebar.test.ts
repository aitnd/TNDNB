import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'

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

  it('Ràng buộc bất di bất dịch: ontap-web/components/ExamQuizScreen.tsx có git diff = 0', () => {
    const diff = execSync('git diff ontap-web/components/ExamQuizScreen.tsx', { encoding: 'utf8' })
    expect(diff.trim()).toBe('')
  })
})

describe('Phase 02: App Shell, Split-Window WelcomeModal & Bento 12-Col Dashboard', () => {
  it('Task 2.2: WelcomeModal.tsx áp dụng bố cục Split Window (md:col-span-7 & md:col-span-5), tabular-nums và xóa sạch viền neon blur-xl', () => {
    const welcomeModal = fs.readFileSync(
      path.resolve(rootDir, 'ontap-web/components/WelcomeModal.tsx'),
      'utf8'
    )

    expect(welcomeModal).not.toContain('via-blue-500 to-violet-500')
    expect(welcomeModal).not.toContain('blur-xl')
    expect(welcomeModal).toContain('md:col-span-7')
    expect(welcomeModal).toContain('md:col-span-5')
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

  it('Task 3.4: Bảo toàn tuyệt đối ExamQuizScreen.tsx (git diff === "")', () => {
    const examQuizDiff = execSync('git diff ontap-web/components/ExamQuizScreen.tsx', {
      cwd: rootDir,
      encoding: 'utf8',
    })
    expect(examQuizDiff.trim()).toBe('')
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



