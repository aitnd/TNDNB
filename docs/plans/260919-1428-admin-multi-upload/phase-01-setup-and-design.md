# Phase 1: Setup and Design

## Objectives
- Review existing Admin UI code.
- Design data models and upload architecture.

## Tasks

### Task 1: Database Schema Updates
- **Bite-sized definition**: Design the Database schema updates (`app_releases` table) to track multiple files per release.
- **Test snippet (`supabase/tests/schema.spec.sql`)**:
```sql
BEGIN;
SELECT plan(1);
SELECT has_table('public', 'app_releases');
SELECT * FROM finish();
ROLLBACK;
```
- **Run test command**: `supabase test db supabase/tests/schema.spec.sql`
- **Implementation snippet (`supabase/migrations/xxxx_create_app_releases.sql`)**:
```sql
CREATE TABLE IF NOT EXISTS public.app_releases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  version text NOT NULL,
  files jsonb NOT NULL DEFAULT '[]',
  created_at timestamptz DEFAULT now()
);
```
- **Git commit**: `git commit -m "chore(db): define app_releases schema for multi-upload"`
