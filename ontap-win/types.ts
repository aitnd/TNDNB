import type { Session } from '@supabase/supabase-js';

declare global {
  interface Window {
    electron: {
      isElectron: boolean;
      appVersion: string;
      invoke: (channel: string, ...args: any[]) => Promise<any>;
      on: (channel: string, func: (...args: any[]) => void) => void;
      onUpdateProgress: (callback: (percent: number) => void) => void;
      onUpdateDownloaded: (callback: () => void) => void;
      onUpdateError: (callback: (err: string) => void) => void;
      downloadUpdate: (url?: string) => void;
      installUpdate: () => void;
      getAutoLaunch: () => Promise<boolean>;
      setAutoLaunch: (value: boolean) => Promise<boolean>;
    };
  }
}


export type Theme = 'light' | 'dark' | 'modern' | 'classic' | 'sunrise' | 'tri-an' | 'noel';

export interface Answer {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  text: string;
  image?: string;
  answers: Answer[];
  correctAnswerId: string;
}

export interface Subject {
  id: string;
  name: string;
  questions: Question[];
}

export interface License {
  id: string;
  name: string;
  subjects: Subject[];
}

export interface UserProgress {
  lastScore: number | null;
  lastScoreTimestamp: number | null;
  highScore: number;
  highScoreTimestamp: number | null;
}

export type UserProgressData = Record<string, UserProgress>; // Key is subjectId

export interface Quiz {
  id: string;
  title: string;
  questions: Question[];
  timeLimit?: number; // in seconds
}

export type AppState =
  | 'welcome'
  | 'login'
  | 'dashboard'
  | 'license_selection'
  | 'name_input'
  | 'mode_selection'
  | 'subject_selection' // For Practice mode
  | 'in_quiz'
  | 'in_online_exam'
  | 'results'
  | 'exam_result'
  | 'history'
  | 'account';

export type UserAnswers = Record<string, string>;

export interface UserProfile {
  id: string;
  email?: string;
  full_name: string;
  fullName?: string; // Add camelCase support
  role: 'admin' | 'giao_vien' | 'hoc_vien' | 'quan_ly' | 'lanh_dao';
  photoURL?: string;
  birthDate?: string;
  address?: string;
  class?: string; // Lớp học (e.g. Thợ máy k2)
  phoneNumber?: string;
  courseName?: string;
  courseId?: string;
  cccd?: string;
  cccdDate?: string;
  cccdPlace?: string;
  courseCode?: string; // Keeping for compatibility if needed, but primary is courseName
  defaultLicenseId?: string; // License ID assigned by class
  isVerified?: boolean;
}