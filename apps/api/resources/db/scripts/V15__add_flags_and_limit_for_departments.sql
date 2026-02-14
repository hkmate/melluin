ALTER TABLE public.hospital_visit
    ADD COLUMN vicarious_mom_visit BOOL NOT NULL DEFAULT FALSE;
ALTER TABLE public.hospital_visit
    ALTER COLUMN vicarious_mom_visit DROP DEFAULT;
--
ALTER TABLE public.hospital_department
    ADD COLUMN limit_of_visits SMALLINT NOT NULL DEFAULT 1;
ALTER TABLE public.hospital_department
    ALTER COLUMN limit_of_visits DROP DEFAULT;
--
ALTER TABLE public.hospital_department
    ADD COLUMN vicarious_mom_included_in_limit BOOL NOT NULL DEFAULT FALSE;
ALTER TABLE public.hospital_department
    ALTER COLUMN vicarious_mom_included_in_limit DROP DEFAULT;
