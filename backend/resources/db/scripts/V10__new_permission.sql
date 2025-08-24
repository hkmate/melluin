INSERT INTO public.permission VALUES ('6ac9184d-58ed-4a6c-87a1-e101e86de52f', 'canReadPersonCreateData');
INSERT INTO public.permission VALUES ('5d197bfc-9e81-4a6b-8a31-09013b0385e0', 'canReadUserCreateData');
INSERT INTO public.permission VALUES ('05376635-fb70-440b-8132-36882d5f3faf', 'canReadUserLastLoginData');


INSERT INTO public.role_permission
    SELECT id, '6ac9184d-58ed-4a6c-87a1-e101e86de52f'
    FROM public.role
    WHERE type in ('SYSADMIN', 'ADMINISTRATOR', 'COORDINATOR');

INSERT INTO public.role_permission
    SELECT id, '5d197bfc-9e81-4a6b-8a31-09013b0385e0'
    FROM public.role
    WHERE type in ('SYSADMIN', 'ADMINISTRATOR', 'COORDINATOR');

INSERT INTO public.role_permission
    SELECT id, '05376635-fb70-440b-8132-36882d5f3faf'
    FROM public.role
    WHERE type in ('SYSADMIN', 'ADMINISTRATOR', 'COORDINATOR');