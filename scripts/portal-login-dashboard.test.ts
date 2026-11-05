import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'

describe('Phase 01: Single Canonical Hallmark Editorial Shell & Legacy Theme Removal', () => {
  const rootDir = process.cwd()

  it('Đã xóa hoàn toàn 5 file của hệ thống đa theme và nhạc/hiệu ứng Noel cũ', () => {
    const removedFiles = [
      'context/ThemeContext.tsx',
      'components/ThemeSwitcher.tsx',
      'components/ThemeSwitcher.module.css',
      'components/ThemeEffects.tsx',
      'components/MusicPlayer.tsx',
    ]
    for (const relPath of removedFiles) {
      expect(fs.existsSync(path.resolve(rootDir, relPath))).toBe(false)
    }
  })

  it('Global Shell (globals.css, layout.tsx, Navbar, Footer, Sidebar, page.module.css) khóa chặt 1 giao diện Hallmark Editorial duy nhất', () => {
    const globalsCss = fs.readFileSync(path.resolve(rootDir, 'app/globals.css'), 'utf8')
    const layoutTsx = fs.readFileSync(path.resolve(rootDir, 'app/layout.tsx'), 'utf8')
    const navbarCss = fs.readFileSync(path.resolve(rootDir, 'components/Navbar.module.css'), 'utf8')
    const footerTsx = fs.readFileSync(path.resolve(rootDir, 'components/Footer.tsx'), 'utf8')
    const sidebarCss = fs.readFileSync(path.resolve(rootDir, 'components/Sidebar.module.css'), 'utf8')
    const homeCss = fs.readFileSync(path.resolve(rootDir, 'app/page.module.css'), 'utf8')

    expect(globalsCss).toContain('--color-paper: #FAF9F6')
    expect(globalsCss).toContain('--color-ink: #0B132B')
    expect(globalsCss).toContain('--color-accent: #003566')
    expect(globalsCss).toContain('--color-gold: #D4AF37')
    expect(globalsCss).toContain('--radius-editorial: 4px')
    expect(globalsCss).not.toContain('[data-theme=')
    expect(globalsCss).not.toContain('.snowflakes')
    expect(globalsCss).not.toContain('.decor-img')

    expect(layoutTsx).not.toContain('ThemeProvider')
    expect(layoutTsx).not.toContain('ThemeEffects')
    expect(layoutTsx).not.toContain('MusicPlayer')

    expect(footerTsx).not.toContain('decor-img')
    expect(navbarCss).not.toContain('data-theme')
    expect(sidebarCss).not.toContain('data-theme')
    expect(homeCss).not.toContain('data-theme')
  })

  it('Navbar.tsx hiển thị nút "Đăng nhập" thay vì "Đăng nhập cán bộ" và không còn ThemeSwitcher', () => {
    const navbarContent = fs.readFileSync(path.resolve(rootDir, 'components/Navbar.tsx'), 'utf8')
    expect(navbarContent).toContain('href="/login"')
    expect(navbarContent).not.toContain('Đăng nhập cán bộ')
    expect(navbarContent).not.toContain('ThemeSwitcher')
    expect(navbarContent).not.toContain('useTheme')
    expect(navbarContent).toMatch(/>\s*Đăng nhập\s*</)
  })

  it('Phase 02: app/login/page.tsx và app/login/page.module.css tồn tại, xử lý đủ luồng Auth và chuẩn Hallmark Editorial', () => {
    const loginPagePath = path.resolve(rootDir, 'app/login/page.tsx')
    const loginCssPath = path.resolve(rootDir, 'app/login/page.module.css')
    expect(fs.existsSync(loginPagePath)).toBe(true)
    expect(fs.existsSync(loginCssPath)).toBe(true)

    const loginCode = fs.readFileSync(loginPagePath, 'utf8')
    const loginCss = fs.readFileSync(loginCssPath, 'utf8')

    expect(loginCode).toContain('signInWithEmailAndPassword')
    expect(loginCode).toContain('createUserWithEmailAndPassword')
    expect(loginCode).toContain('signInWithPopup')
    expect(loginCode).toContain('sendPasswordResetEmail')
    expect(loginCode).toContain('recordLoginSession')
    expect(loginCode).toContain('auth/unauthorized-domain')
    expect(loginCode).toContain('@gmail.com')
    expect(loginCode).toContain('/quan-ly')

    expect(loginCss).toContain('var(--color-paper')
    expect(loginCss).toContain('var(--color-surface')
    expect(loginCss).toContain('var(--color-accent')
    expect(loginCss).toContain('var(--radius-editorial')
  })

  it('Phase 03: app/quan-ly/page.tsx và các trang con quản trị tồn tại, bọc trong ProtectedRoute và đồng bộ Hallmark Editorial', () => {
    const quanLyPagePath = path.resolve(rootDir, 'app/quan-ly/page.tsx')
    const quanLyCssPath = path.resolve(rootDir, 'app/quan-ly/page.module.css')
    expect(fs.existsSync(quanLyPagePath)).toBe(true)
    expect(fs.existsSync(quanLyCssPath)).toBe(true)

    const quanLyCode = fs.readFileSync(quanLyPagePath, 'utf8')
    const quanLyCss = fs.readFileSync(quanLyCssPath, 'utf8')

    expect(quanLyCode).toContain('ProtectedRoute')
    expect(quanLyCode).toContain('AnalyticsWidget')
    expect(quanLyCode).toContain('CourseManager')
    expect(quanLyCode).toContain('PostManager')
    expect(quanLyCode).toContain('ReviewManager')
    expect(quanLyCode).toContain('StudentCard')
    expect(quanLyCode).toContain('StudentClassView')
    expect(quanLyCode).toContain('StudentHistory')
    expect(quanLyCode).toContain('/quan-ly/ho-so')
    expect(quanLyCode).toContain('/quan-ly/tai-khoan')

    expect(quanLyCss).toContain('var(--color-paper')
    expect(quanLyCss).toContain('var(--color-accent')
    expect(quanLyCss).toContain('var(--radius-editorial')

    const subAdminCssFiles = [
      'app/quan-ly/ho-so/page.module.css',
      'app/quan-ly/tai-khoan/page.module.css',
      'app/quan-ly/dang-bai/page.module.css',
      'app/quan-ly/[roomId]/page.module.css',
    ]
    for (const relCss of subAdminCssFiles) {
      const cssContent = fs.readFileSync(path.resolve(rootDir, relCss), 'utf8')
      expect(cssContent).toContain('var(--color-')
    }
  })

  it('Phase 04: Toàn bộ 11 file CSS Module của 10 nhóm trang nội dung Portal đồng bộ Hallmark Editorial Tokens', () => {
    const contentCssFiles = [
      'app/bai-viet/[postId]/page.module.css',
      'app/danh-muc/[categoryId]/page.module.css',
      'app/gioi-thieu/page.module.css',
      'app/hoc-phi/page.module.css',
      'app/lien-he/page.module.css',
      'app/tai-lieu/page.module.css',
      'app/thu-vien/page.module.css',
      'app/chuong-trinh-dao-tao/page.module.css',
      'app/chuong-trinh-dao-tao/chuong-trinh.module.css',
      'app/tu-van-nghe-nghiep/tu-van.module.css',
      'app/tim-kiem/page.module.css',
    ]

    for (const relCss of contentCssFiles) {
      const css = fs.readFileSync(path.resolve(rootDir, relCss), 'utf8')
      expect(css).toContain('var(--color-')
      expect(css).toContain('var(--radius-editorial')
      expect(css).not.toContain('data-theme')
    }

    const hocPhiCss = fs.readFileSync(path.resolve(rootDir, 'app/hoc-phi/page.module.css'), 'utf8')
    expect(hocPhiCss).toContain('tabular-nums')
  })

  it('Analytics Robustness: app/api/analytics/route.ts hỗ trợ GET an toàn và components/AnalyticsWidget.tsx parse JSON an toàn chuẩn Hallmark', () => {
    const routePath = path.resolve(rootDir, 'app/api/analytics/route.ts')
    const widgetPath = path.resolve(rootDir, 'components/AnalyticsWidget.tsx')

    expect(fs.existsSync(routePath)).toBe(true)
    expect(fs.existsSync(widgetPath)).toBe(true)

    const routeCode = fs.readFileSync(routePath, 'utf8')
    const widgetCode = fs.readFileSync(widgetPath, 'utf8')

    // 1. API Route must export GET and POST with totalUsers / totalPageViews fallback
    expect(routeCode).toMatch(/export\s+async\s+function\s+GET/)
    expect(routeCode).toMatch(/export\s+async\s+function\s+POST/)
    expect(routeCode).toContain('totalUsers')
    expect(routeCode).toContain('totalPageViews')
    expect(routeCode).toContain('isMock')

    // 2. Widget must parse JSON safely without crashing on empty response
    expect(widgetCode).toMatch(/res\.text\(\)|JSON\.parse/)
    expect(widgetCode).not.toContain('#fde8e8')
    expect(widgetCode).not.toContain('#9b2c2c')
    expect(widgetCode).not.toContain("fontStyle: 'italic'")
    expect(widgetCode).not.toContain('fontStyle: "italic"')
  })
})
