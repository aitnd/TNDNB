export interface WorkerEnv {
  DB: D1Database;
  ASSETS_BUCKET: R2Bucket;
  GITHUB_OWNER: string;
  GITHUB_REPO: string;
  RELEASE_UPSTREAM_MODE: 'github_proxy' | 'r2_direct';
  ALLOWED_ORIGINS: string;
  ADMIN_API_SECRET?: string;
  GITHUB_TOKEN?: string;
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

export function parseAllowedOrigins(raw: string): string[] {
  if (!raw || !raw.trim()) {
    return ['*'];
  }
  return raw
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}
