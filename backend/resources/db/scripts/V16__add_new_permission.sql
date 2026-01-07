
INSERT INTO public.permission VALUES ('2ea3550f-90c2-4712-b206-122fbaf72a15', 'canForceSameTimeVisitWrite');

INSERT INTO public.role_permission
SELECT id, '2ea3550f-90c2-4712-b206-122fbaf72a15'
FROM public.role
WHERE type in ('SYSADMIN');
