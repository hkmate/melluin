
INSERT INTO public.permission VALUES ('316a7951-7832-4ba4-9325-cd2144517cf7', 'canReadVisitConnections');

INSERT INTO public.role_permission
SELECT id, '316a7951-7832-4ba4-9325-cd2144517cf7'
FROM public.role
WHERE type in ('SYSADMIN', 'ADMINISTRATOR', 'COORDINATOR');

INSERT INTO public.permission VALUES ('98494e6a-dd29-4c26-a382-9c897a53b9f6', 'canWriteVisitConnections');

INSERT INTO public.role_permission
SELECT id, '98494e6a-dd29-4c26-a382-9c897a53b9f6'
FROM public.role
WHERE type in ('SYSADMIN', 'ADMINISTRATOR', 'COORDINATOR');


ALTER TABLE public.hospital_visit ADD COLUMN group_id uuid;
UPDATE public.hospital_visit SET group_id = id;
ALTER TABLE public.hospital_visit ALTER COLUMN group_id SET NOT NULL;
