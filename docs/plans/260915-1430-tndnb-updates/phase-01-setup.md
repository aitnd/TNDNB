# Phase 1: Setup & Codebase Familiarization

**Objective:** Map out the exact components and architecture requirements before making changes.

## 1. Login Component Rendering Architecture
By inspecting AppRoutes.tsx, the application uses a split authentication routing strategy:
- **Windows (Electron):** Dòng 108-114 kiểm tra `isElectron && !userProfile` và render `<WindowsLoginScreen />` trực tiếp khi khởi động.
- **Web:** Dòng ~171 route `/ontap/login` render `<LoginScreen onBack={...} />`.
- **Conclusion:** Both LoginScreen.tsx and WindowsLoginScreen.tsx handle authentication logic and both must be patched, although their specific failure points differ slightly.

## 2. Quiz Screens Location
The primary reading environments that require the zoom feature (6 màn — web và win đều có đủ 3 màn):
- `ontap-web/components/QuizScreen.tsx`, `ExamQuizScreen.tsx`, `ExamQuizScreen2.tsx`
- `ontap-win/components/QuizScreen.tsx`, `ExamQuizScreen.tsx`, `ExamQuizScreen2.tsx`
- (QuizScreen props: quiz, onFinish, onBack, initialIndex, initialAnswers, onProgressUpdate).
- Chưa màn nào có bottom bar. ZoomBar sẽ inject ở cuối return JSX mỗi màn.

## 3. Zoom Architecture
We will NOT use global zoom (CSS zoom or webFrame). We will create a local state hook useFontScale and a ZoomBar component to scale specific content nodes using the --content-scale CSS variable.

## Verification:
- Open AppRoutes.tsx and manually verify the routing logic.
- Confirm WindowsLoginScreen.tsx is being served in the Electron desktop environment.
