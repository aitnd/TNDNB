import { create } from 'zustand';
import { License, Subject, Quiz, UserAnswers, UserProfile } from '../types';

// Re-using AppState constants for compatibility
export const AppState = {
    WELCOME: 'welcome',
    LOGIN: 'login',
    DASHBOARD: 'dashboard',
    LICENSE_SELECTION: 'license_selection',
    NAME_INPUT: 'name_input',
    MODE_SELECTION: 'mode_selection',
    SUBJECT_SELECTION: 'subject_selection',
    IN_QUIZ: 'in_quiz',
    IN_ONLINE_EXAM: 'in_online_exam',
    RESULT: 'results',
    EXAM_RESULT: 'exam_result',
    HISTORY: 'history',
    MY_CLASS: 'my_class',
    CLASS_MANAGEMENT: 'class_management',
    REGISTER: 'register',
    ACCOUNT: 'account',
    NOTIFICATION_MGMT: 'notification_mgmt',
    MAILBOX: 'mailbox',
    THI_TRUC_TUYEN: 'thi_truc_tuyen',
    ONLINE_EXAM_MANAGEMENT: 'online_exam_management',
    ANALYTICS: 'analytics'
} as const;

export type AppStateType = typeof AppState[keyof typeof AppState];

interface AppStore {
    // Navigation State
    appState: AppStateType;
    setAppState: (state: AppStateType) => void;

    // Data State
    licenses: License[];
    setLicenses: (licenses: License[]) => void;
    selectedLicense: License | null;
    setSelectedLicense: (license: License | null) => void;

    subjects: Subject[];
    setSubjects: (subjects: Subject[]) => void;
    selectedSubject: Subject | null;
    setSelectedSubject: (subject: Subject | null) => void;

    // Quiz/Exam State
    currentQuiz: Quiz | null;
    setCurrentQuiz: (quiz: Quiz | null) => void;
    userAnswers: UserAnswers;
    setUserAnswers: (answers: UserAnswers) => void;
    score: number;
    setScore: (score: number) => void;

    // User State
    userName: string;
    setUserName: (name: string) => void;
    userProfile: UserProfile | null;
    setUserProfile: (profile: UserProfile | null) => void;

    // System State
    resumeSessionAvailable: boolean;
    setResumeSessionAvailable: (available: boolean) => void;
    isMobileApp: boolean;
    setIsMobileApp: (isMobile: boolean) => void;

    // Phase 03 Features
    incorrectQuestionIds: string[];
    addIncorrectQuestions: (ids: string[]) => void;
    removeIncorrectQuestion: (id: string) => void;

    streakCount: number;
    lastActiveDate: string;
    updateStreak: () => void;

    // Actions (Complex logic can move here later)
    resetQuizState: () => void;
}

const safeParseList = (v: string | null): string[] => {
    try {
        const parsed = JSON.parse(v || '[]');
        return Array.isArray(parsed) ? parsed : [];
    } catch { return []; }
};

const safeParseCount = (v: string | null): number => {
    const n = parseInt(v || '0', 10);
    return isNaN(n) ? 0 : n;
};

export const useAppStore = create<AppStore>((set, get) => ({
    // Initial Values
    appState: AppState.WELCOME,
    licenses: [],
    selectedLicense: null,
    subjects: [],
    selectedSubject: null,
    currentQuiz: null,
    userAnswers: {},
    score: 0,
    userName: '',
    userProfile: null,
    resumeSessionAvailable: false,
    isMobileApp: false,

    // Setters
    setAppState: (appState) => set({ appState }),
    setLicenses: (licenses) => set({ licenses }),
    setSelectedLicense: (selectedLicense) => set({ selectedLicense }),
    setSubjects: (subjects) => set({ subjects }),
    setSelectedSubject: (selectedSubject) => set({ selectedSubject }),
    setCurrentQuiz: (currentQuiz) => set({ currentQuiz }),
    setUserAnswers: (userAnswers) => set({ userAnswers }),
    setScore: (score) => set({ score }),
    setUserName: (userName) => set({ userName }),
    setUserProfile: (userProfile) => set({ userProfile }),
    setResumeSessionAvailable: (resumeSessionAvailable) => set({ resumeSessionAvailable }),
    setIsMobileApp: (isMobileApp) => set({ isMobileApp }),

    // Helpers
    resetQuizState: () => set({
        currentQuiz: null,
        userAnswers: {},
        score: 0
    }),

    // Phase 03 Features Implementation
    incorrectQuestionIds: safeParseList(localStorage.getItem('incorrectQuestionIds')),
    addIncorrectQuestions: (ids: string[]) => set((state) => {
        const newIds = Array.from(new Set([...state.incorrectQuestionIds, ...ids]));
        localStorage.setItem('incorrectQuestionIds', JSON.stringify(newIds));
        return { incorrectQuestionIds: newIds };
    }),
    removeIncorrectQuestion: (id: string) => set((state) => {
        const newIds = state.incorrectQuestionIds.filter(qId => qId !== id);
        localStorage.setItem('incorrectQuestionIds', JSON.stringify(newIds));
        return { incorrectQuestionIds: newIds };
    }),

    streakCount: safeParseCount(localStorage.getItem('streakCount')),
    lastActiveDate: localStorage.getItem('lastActiveDate') || '',
    updateStreak: () => {
        const dayStr = (d: Date): string =>
            `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        const today = dayStr(new Date());
        const { lastActiveDate, streakCount } = get();
        if (lastActiveDate === today) return;
        
        const yesterday = dayStr(new Date(Date.now() - 86400000));
        const newStreak = lastActiveDate === yesterday ? streakCount + 1 : 1;
        
        localStorage.setItem('streakCount', newStreak.toString());
        localStorage.setItem('lastActiveDate', today);
        set({ streakCount: newStreak, lastActiveDate: today });
    },
}));
