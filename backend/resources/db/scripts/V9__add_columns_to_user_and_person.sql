ALTER TABLE public."user" ADD COLUMN last_login timestamp without time zone;

ALTER TABLE public."user" ADD COLUMN created timestamp without time zone;
ALTER TABLE public."user" ADD COLUMN created_by uuid;

ALTER TABLE public.person ADD COLUMN created timestamp without time zone;
ALTER TABLE public.person ADD COLUMN created_by uuid;


ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user__created_by__to__person__id FOREIGN KEY (created_by) REFERENCES public.person(id);

ALTER TABLE ONLY public.person
    ADD CONSTRAINT pesron__created_by__to__person__id FOREIGN KEY (created_by) REFERENCES public.person(id);
