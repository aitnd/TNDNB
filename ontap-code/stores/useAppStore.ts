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
    MAILBOX: 'mailbox'
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

    // Actions (Complex logic can move here later)
    resetQuizState: () => void;
}

export const useAppStore = create<AppStore>((set) => ({
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
}));
