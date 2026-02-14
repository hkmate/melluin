
INSERT INTO public.permission VALUES ('be26a33b-5e7e-4e22-9ba4-aa8160bd38a6', 'canWriteChildAtAnyVisit');

INSERT INTO public.role_permission
SELECT id, 'be26a33b-5e7e-4e22-9ba4-aa8160bd38a6'
FROM public.role
WHERE type in ('SYSADMIN', 'ADMINISTRATOR', 'COORDINATOR');


INSERT INTO public.permission VALUES ('1df4a721-dbe4-42c8-ad68-58ed8bfe817b', 'canWriteActivityAtAnyVisit');

INSERT INTO public.role_permission
SELECT id, '1df4a721-dbe4-42c8-ad68-58ed8bfe817b'
FROM public.role
WHERE type in ('SYSADMIN', 'ADMINISTRATOR', 'COORDINATOR');
