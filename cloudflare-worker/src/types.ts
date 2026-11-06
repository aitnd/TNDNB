export interface WorkerEnv {
  DB: D1Database;
  ASSETS_BUCKET: R2Bucket;
  CONFIG_KV: KVNamespace;
  GITHUB_OWNER: string;
  GITHUB_REPO: string;
  RELEASE_UPSTREAM_MODE: 'github_proxy' | 'r2_direct';
  ALLOWED_ORIGINS: string;
  ADMIN_API_SECRET?: string;
  GITHUB_TOKEN?: string;
  FIREBASE_PROJECT_ID?: string;
  CDN_BASE_URL?: string;
}

export interface SyncMetaDTO {
  id: string;
  version: number;
  contentHash: string;
  totalQuestions: number;
  updatedAt: number;
}

export interface AnswerDTO {
  id: string;
  text: string;
}

export interface QuestionDTO {
  id: string;
  text: string;
  image?: string | null;
  correctAnswerId: string;
  answers: AnswerDTO[];
}

export interface SubjectDTO {
  id: string;
  name: string;
  displayOrder?: number;
  questions: QuestionDTO[];
}

export interface LicenseDTO {
  id: string;
  name: string;
  displayOrder?: number;
  subjects: SubjectDTO[];
}

export interface LicenseRow {
  id: string;
  name: string;
  display_order?: number;
}

export interface SubjectRow {
  id: string;
  license_id: string;
  name: string;
  display_order?: number;
}

export interface QuestionRow {
  id: string;
  subject_id: string;
  text: string;
  image?: string | null;
  correct_answer_id: string;
  display_order?: number;
}

export interface AnswerRow {
  id: string;
  question_id: string;
  text: string;
  display_order?: number;
}

export interface AlertDbRow {
  id: string;
  title: string;
  message: string;
  type: string;
  target_type: string;
  target_id?: string | null;
  target_name?: string | null;
  target_roles_json?: string | null;
  sender_id: string;
  sender_name?: string | null;
  created_at: number | string;
  expiry_date?: number | string | null;
  read_by_json?: string | null;
  deleted_by_json?: string | null;
}

export function parseAllowedOrigins(raw: string): string[] {
  if (!raw || !raw.trim()) {
    return ['*'];
  }
  return raw
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}
