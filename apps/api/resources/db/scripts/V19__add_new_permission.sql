INSERT INTO public.permission VALUES ('56566eb2-6544-4726-ac0b-d223b7df15f0', 'canModifyAnyVisitUnrestricted');

INSERT INTO public.role_permission
SELECT id, '56566eb2-6544-4726-ac0b-d223b7df15f0'
FROM public.role
WHERE type in ('SYSADMIN');
