BEGIN;
SELECT plan(1);
SELECT has_table('public', 'app_releases');
SELECT * FROM finish();
ROLLBACK;
