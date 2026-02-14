
CREATE TABLE public.user_permission (
    user_id uuid NOT NULL,
    permission_id uuid NOT NULL
);

ALTER TABLE ONLY public.user_permission
    ADD CONSTRAINT user_permission__id__primary_key PRIMARY KEY (permission_id, user_id);

ALTER TABLE ONLY public.user_permission
    ADD CONSTRAINT user_permission__user_id__to__user__id FOREIGN KEY (user_id) REFERENCES public.user(id);
ALTER TABLE ONLY public.user_permission
    ADD CONSTRAINT user_permission__permission_id__to__permission__id FOREIGN KEY (permission_id) REFERENCES public.permission(id);

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role__role__unique UNIQUE (role);

INSERT INTO public.permission VALUES ('bc59a82a-42d2-4973-8a82-75a7ee86caae', 'canManagePermissions');
INSERT INTO public.role_permission VALUES ('6a0ee1be-7352-11ed-a1eb-0242ac120002', 'bc59a82a-42d2-4973-8a82-75a7ee86caae');
