ALTER TABLE public.role RENAME COLUMN role TO "name";
ALTER TABLE public.role ADD CONSTRAINT role__name__unique UNIQUE ("name");
ALTER TABLE public.role ADD COLUMN "type" text;

UPDATE public.role SET type = 'INTERN' WHERE name = 'INTERN_HOSPITAL_VISITOR';
UPDATE public.role SET type = 'VISITOR' WHERE name = 'BEGINNER_HOSPITAL_VISITOR';
UPDATE public.role SET type = 'VISITOR' WHERE name = 'HOSPITAL_VISITOR';
UPDATE public.role SET type = 'VISITOR' WHERE name = 'MENTOR_HOSPITAL_VISITOR';
UPDATE public.role SET type = 'COORDINATOR' WHERE name = 'HOSPITAL_VISIT_COORDINATOR';
UPDATE public.role SET type = 'COORDINATOR' WHERE name = 'FAIRY_PAINTING_COORDINATOR';
UPDATE public.role SET type = 'COORDINATOR' WHERE name = 'TOY_MAKING_COORDINATOR';
UPDATE public.role SET type = 'ADMINISTRATOR' WHERE name = 'ADMINISTRATOR';
UPDATE public.role SET type = 'SYSADMIN' WHERE name = 'SYSADMIN';


INSERT INTO public.permission VALUES ('c139fdd7-2cfb-4965-99df-2ebe7d8ad19e', 'canReadSensitivePersonData');

-- To HOSPITAL_VISIT_COORDINATOR, FAIRY_PAINTING_COORDINATOR, TOY_MAKING_COORDINATOR, ADMINISTRATOR, SYSADMIN
INSERT INTO public.role_permission VALUES ('f16a36e3-4d0e-4577-a80b-a78f94f3467c', 'c139fdd7-2cfb-4965-99df-2ebe7d8ad19e');
INSERT INTO public.role_permission VALUES ('c8f06889-eda6-4da2-8e22-7aa3394ab0a7', 'c139fdd7-2cfb-4965-99df-2ebe7d8ad19e');
INSERT INTO public.role_permission VALUES ('56636955-f72d-4e62-92bf-5e00c7cfd3d8', 'c139fdd7-2cfb-4965-99df-2ebe7d8ad19e');
INSERT INTO public.role_permission VALUES ('c8e583b6-0591-47b4-bd4c-12f3811ebbea', 'c139fdd7-2cfb-4965-99df-2ebe7d8ad19e');
INSERT INTO public.role_permission VALUES ('6a0ee1be-7352-11ed-a1eb-0242ac120002', 'c139fdd7-2cfb-4965-99df-2ebe7d8ad19e');