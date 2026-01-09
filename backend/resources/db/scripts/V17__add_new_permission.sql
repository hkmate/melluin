
INSERT INTO public.permission VALUES ('9884ae6f-895c-4d75-9a72-0f14ab9235c8', 'canModifyAnyVisit');

INSERT INTO public.role_permission
SELECT id, '9884ae6f-895c-4d75-9a72-0f14ab9235c8'
FROM public.role
WHERE type in ('SYSADMIN', 'ADMINISTRATOR', 'COORDINATOR');


INSERT INTO public.permission VALUES ('bf0e6ab9-186f-4d3f-9c4f-6de1469e25ce', 'canCreateAnyVisit');

INSERT INTO public.role_permission
SELECT id, 'bf0e6ab9-186f-4d3f-9c4f-6de1469e25ce'
FROM public.role
WHERE type in ('SYSADMIN', 'ADMINISTRATOR', 'COORDINATOR');
