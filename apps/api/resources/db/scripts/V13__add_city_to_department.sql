ALTER TABLE public.hospital_department
    ADD COLUMN city text NOT NULL DEFAULT 'PECS';

ALTER TABLE public.hospital_department
    ALTER COLUMN city DROP DEFAULT;
