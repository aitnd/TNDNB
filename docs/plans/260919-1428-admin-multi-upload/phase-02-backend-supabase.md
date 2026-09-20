# Phase 2: Backend Supabase

## Objectives
- Implement secure file upload logic to Supabase Storage.
- Update release records in the Database.

## Tasks

### Task 1: Supabase Storage Bucket & Policies
- **Bite-sized definition**: Create Supabase Storage bucket/policies for release files (.exe, .yml, .blockmap).
- **Test snippet (`supabase/tests/storage.spec.sql`)**:
```sql
BEGIN;
SELECT plan(1);
SELECT is_empty('SELECT 1 FROM storage.buckets WHERE id = ''releases''');
SELECT * FROM finish();
ROLLBACK;
```
- **Run test command**: `supabase test db supabase/tests/storage.spec.sql`
- **Implementation snippet (`supabase/migrations/xxxx_create_bucket.sql`)**:
```sql
INSERT INTO storage.buckets (id, name, public) VALUES ('releases', 'releases', true);
```
- **Git commit**: `git commit -m "feat(storage): create releases bucket and policies"`

### Task 2: Backend logic for database records
- **Bite-sized definition**: Create or update Database records for the release with links to the uploaded files.
- **Test snippet (`supabase/tests/db_records.spec.sql`)**:
```sql
BEGIN;
SELECT plan(1);
INSERT INTO public.app_releases (version, files) VALUES ('v1.0.0', '["file.exe"]');
SELECT results_eq('SELECT version FROM public.app_releases', ARRAY['v1.0.0']);
SELECT * FROM finish();
ROLLBACK;
```
- **Run test command**: `supabase test db supabase/tests/db_records.spec.sql`
- **Implementation snippet (`src/lib/supabase-server.ts`)**:
```typescript
export async function createReleaseRecord(version: string, files: string[]) {
  return await supabase.from('app_releases').insert([{ version, files }]);
}
```
- **Git commit**: `git commit -m "feat(backend): function to update release records"`
