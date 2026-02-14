ALTER TABLE public.person
    ADD COLUMN cities jsonb NOT NULL DEFAULT '["PECS"]'::jsonb;

ALTER TABLE public.person
    ALTER COLUMN cities DROP DEFAULT;

INSERT INTO public.permission VALUES ('f540d20d-d357-4192-98aa-b9adffcf3c61', 'canModifyPersonCity');


INSERT INTO public.role_permission
SELECT id, 'f540d20d-d357-4192-98aa-b9adffcf3c61'
FROM public.role
WHERE type in ('SYSADMIN', 'ADMINISTRATOR', 'COORDINATOR');




CREATE TABLE public.user_activation
(
    id         uuid NOT NULL,
    created_at timestamp without time zone,
    user_id    uuid NOT NULL,
    action     text NOT NULL -- ACTIVATE, INACTIVATE
);

ALTER TABLE ONLY public.user_activation
    ADD CONSTRAINT user_activation__id__primary_key PRIMARY KEY (id);

ALTER TABLE ONLY public.user_activation
    ADD CONSTRAINT user_activation__user_id__to_person_id FOREIGN KEY (user_id) REFERENCES public.user (id);

INSERT into public.user_activation(id, created_at, user_id, action)
    (select gen_uuid(),
            null,
            id,
            CASE
                WHEN is_active THEN 'ACTIVATE'
                ELSE 'INACTIVATE'
                END
     from public.user)
