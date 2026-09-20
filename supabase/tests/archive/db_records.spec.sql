BEGIN;
SELECT plan(1);
INSERT INTO public.app_releases (version, files) VALUES ('v1.0.0', '{"file.exe": "http"}');
SELECT results_eq('SELECT version FROM public.app_releases WHERE version = ''v1.0.0''', ARRAY['v1.0.0']);
SELECT * FROM finish();
ROLLBACK;
