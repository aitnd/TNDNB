BEGIN;
SELECT plan(1);
SELECT results_eq('SELECT id FROM storage.buckets WHERE id = ''releases''', ARRAY['releases']);
SELECT * FROM finish();
ROLLBACK;
