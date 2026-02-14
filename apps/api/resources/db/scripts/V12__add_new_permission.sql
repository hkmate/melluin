
INSERT INTO public.permission VALUES ('e2d602fd-c447-4b77-8621-57c7580dc957', 'canReadStatistics');


INSERT INTO public.role_permission
SELECT id, 'e2d602fd-c447-4b77-8621-57c7580dc957'
FROM public.role
WHERE type in ('SYSADMIN', 'ADMINISTRATOR', 'COORDINATOR');
