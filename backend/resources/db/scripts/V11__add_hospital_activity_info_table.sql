CREATE TABLE public.hospital_visit_activity_info
(
    id                uuid NOT NULL,
    hospital_visit_id uuid NOT NULL,
    content           text
);

ALTER TABLE ONLY public.hospital_visit_activity_info
    ADD CONSTRAINT hospital_visit_activity_info__id__primary_key PRIMARY KEY (id);

ALTER TABLE ONLY public.hospital_visit_activity_info
    ADD CONSTRAINT activity_info__hospital_visit_id__to__hospital_visit__id FOREIGN KEY (hospital_visit_id) REFERENCES public.hospital_visit(id);
