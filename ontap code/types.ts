import type { Session } from '@supabase/supabase-js';

export type Theme = 'modern' | 'classic' | 'sunrise' | 'tri-an' | 'noel';

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
  | 'results';

export type UserAnswers = Record<string, string>;

export interface UserProfile {
  id: string;
  email?: string;
  role: 'admin' | 'teacher' | 'student' | 'lanh_dao' | 'quan_ly' | 'giao_vien' | 'hoc_vien';
  full_name?: string;
  phoneNumber?: string;
  birthDate?: string;
  address?: string;
  cccd?: string;
  cccdDate?: string;
  cccdPlace?: string;
  class?: string;
  photoURL?: string;
  isVerified?: boolean;
}