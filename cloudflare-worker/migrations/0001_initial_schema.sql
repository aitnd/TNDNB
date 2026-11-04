CREATE TABLE IF NOT EXISTS sync_meta (
    id TEXT PRIMARY KEY DEFAULT 'questions_bank',
    version INTEGER NOT NULL DEFAULT 1,
    content_hash TEXT NOT NULL,
    total_questions INTEGER NOT NULL DEFAULT 0,
    updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS licenses (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    created_at INTEGER DEFAULT (strftime('%s', 'now') * 1000)
);

CREATE TABLE IF NOT EXISTS subjects (
    id TEXT PRIMARY KEY,
    license_id TEXT NOT NULL,
    name TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    created_at INTEGER DEFAULT (strftime('%s', 'now') * 1000),
    FOREIGN KEY (license_id) REFERENCES licenses(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_subjects_license ON subjects(license_id, display_order);

CREATE TABLE IF NOT EXISTS questions (
    id TEXT PRIMARY KEY,
    subject_id TEXT NOT NULL,
    text TEXT NOT NULL,
    image TEXT,
    correct_answer_id TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    created_at INTEGER DEFAULT (strftime('%s', 'now') * 1000),
    updated_at INTEGER DEFAULT (strftime('%s', 'now') * 1000),
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_questions_subject ON questions(subject_id, display_order);

CREATE TABLE IF NOT EXISTS answers (
    id TEXT PRIMARY KEY,
    question_id TEXT NOT NULL,
    text TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_answers_question ON answers(question_id);

CREATE TABLE IF NOT EXISTS app_configs (
    key TEXT PRIMARY KEY,
    value_json TEXT NOT NULL,
    updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS alerts (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'attention',
    target_type TEXT NOT NULL DEFAULT 'all',
    target_id TEXT,
    target_name TEXT,
    target_roles_json TEXT DEFAULT '[]',
    sender_id TEXT,
    sender_name TEXT DEFAULT 'Hệ thống',
    created_at INTEGER NOT NULL,
    expiry_date INTEGER,
    read_by_json TEXT DEFAULT '[]',
    deleted_by_json TEXT DEFAULT '[]'
);
CREATE INDEX IF NOT EXISTS idx_alerts_target_created ON alerts(target_type, created_at DESC);
