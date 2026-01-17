import { Quiz, UserAnswers, License, Subject } from '../types';

const SESSION_KEY = 'ontap_quiz_session';
const LICENSE_KEY = 'ontap_license_pref';

export interface QuizSession {
    userId: string;
    quiz: Quiz;
    mode: 'practice' | 'online_exam';
    userAnswers: UserAnswers;
    currentQuestionIndex: number;
    timeLeft: number; // For exams
    selectedLicense: License | null;
    selectedSubject: Subject | null;
    timestamp: number;
}

export const saveSession = (
    userId: string,
    quiz: Quiz,
    mode: 'practice' | 'online_exam',
    userAnswers: UserAnswers,
    currentQuestionIndex: number,
    timeLeft: number,
    selectedLicense: License | null,
    selectedSubject: Subject | null
) => {
    try {
        const session: QuizSession = {
            userId,
            quiz,
            mode,
            userAnswers,
            currentQuestionIndex,
            timeLeft,
            selectedLicense,
            selectedSubject,
            timestamp: Date.now()
        };
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } catch (e) {
        console.error("Failed to save session", e);
    }
};

export const loadSession = (currentUserId?: string): QuizSession | null => {
    try {
        const json = localStorage.getItem(SESSION_KEY);
        if (!json) return null;

        const session = JSON.parse(json) as QuizSession;

        // Validate User Identity
        if (currentUserId && session.userId !== currentUserId) {
            // Keep the session if it belongs to someone else? 
            // Better to ignore it for THIS user.
            return null;
        }

        // Expire if older than 24 hours
        const ONE_DAY = 24 * 60 * 60 * 1000;
        if (Date.now() - session.timestamp > ONE_DAY) {
            clearSession();
            return null;
        }

        return session;
    } catch (e) {
        console.error("Failed to load session", e);
        return null;
    }
};

export const clearSession = () => {
    localStorage.removeItem(SESSION_KEY);
};

export const saveLicensePreference = (licenseId: string) => {
    localStorage.setItem(LICENSE_KEY, licenseId);
}

export const getLicensePreference = (): string | null => {
    return localStorage.getItem(LICENSE_KEY);
}
