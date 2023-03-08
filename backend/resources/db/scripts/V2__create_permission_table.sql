CREATE TABLE public.permission (
    id uuid NOT NULL,
    permission text NOT NULL
);

CREATE TABLE public.role_permission (
    role_id uuid NOT NULL,
    permission_id uuid NOT NULL
);

ALTER TABLE ONLY public.permission
    ADD CONSTRAINT permission__id__primary_key PRIMARY KEY (id);

ALTER TABLE ONLY public.role_permission
    ADD CONSTRAINT role_permission__id__primary_key PRIMARY KEY (permission_id, role_id);

ALTER TABLE ONLY public.role_permission
    ADD CONSTRAINT role_permission__role_id__to__role__id FOREIGN KEY (role_id) REFERENCES public.role(id);
ALTER TABLE ONLY public.role_permission
    ADD CONSTRAINT role_permission__permission_id__to__permission__id FOREIGN KEY (permission_id) REFERENCES public.permission(id);

-- NOTE: To check the role-permission relations more readable, execute this in the db:
-- select r."role", p."permission"
--     from "role" r
--     join role_permission rp on r.id = rp.role_id
--     join "permission" p on rp.permission_id  = p.id;

INSERT INTO public.permission VALUES ('b698d633-a946-4639-8e40-eb59fbb1be06', 'canWriteChild');
INSERT INTO public.permission VALUES ('c7ee301c-d4e7-4203-bee3-dd899955de34', 'canReadChild');
INSERT INTO public.permission VALUES ('23cb2236-3e0c-485b-b25b-96fc602ce3e9', 'canWriteDepartment');
INSERT INTO public.permission VALUES ('4858cb0e-ce04-4109-97c8-e5c222e85c4e', 'canReadDepartment');
INSERT INTO public.permission VALUES ('3658ea1d-abc9-4bda-bcf1-a2d545add52a', 'canSearchDepartment');
INSERT INTO public.permission VALUES ('65b00329-95e2-48ab-a46b-3f8ff9ccef3e', 'canWriteDepBox');
INSERT INTO public.permission VALUES ('b926991d-2e58-4e6a-b353-c5e6588a50b6', 'canReadDepBox');
INSERT INTO public.permission VALUES ('453ea183-3e8a-4c87-9359-2f06b7c88717', 'canCreateVisit');
INSERT INTO public.permission VALUES ('f6fefced-4a95-41a1-b1a8-3d046f2b7df1', 'canReadVisit');
INSERT INTO public.permission VALUES ('61936b2d-e589-4acc-8142-981dcbc05127', 'canModifyVisit');
INSERT INTO public.permission VALUES ('52643a20-817d-4a18-b5c9-4ab9e90eaf26', 'canCreateActivity');
INSERT INTO public.permission VALUES ('f4ddef64-1a74-49e2-b3e1-63bcc7ff2901', 'canReadActivity');
INSERT INTO public.permission VALUES ('323f408b-352f-4edc-9623-9198db8208ae', 'canWriteVisitor');
INSERT INTO public.permission VALUES ('123c8d0d-2292-4df6-bc61-e584d944b710', 'canWriteCoordinator');
INSERT INTO public.permission VALUES ('f57acd80-355d-4274-a096-683e6a211702', 'canWriteAdmin');
INSERT INTO public.permission VALUES ('3887c8ca-a96b-444d-9154-94c4ce779cba', 'canWriteSysAdmin');
INSERT INTO public.permission VALUES ('0aa3b65d-a676-407a-b05a-ab6d5318df41', 'canWriteSelf');
INSERT INTO public.permission VALUES ('87175d35-5088-4a6b-8933-537047fb1147', 'canCreateUser');
INSERT INTO public.permission VALUES ('c403121a-ad6f-4b84-b1dc-b3be73e668d1', 'canCreatePerson');
INSERT INTO public.permission VALUES ('0c883145-d404-40d2-aeef-847de7c5828c', 'canReadPerson');
INSERT INTO public.permission VALUES ('f2a62b08-1efb-4fb7-ac8c-4c83ef6a77e9', 'canSearchPerson');


-- Permissions of SYSADMIN
INSERT INTO public.role_permission VALUES ('6a0ee1be-7352-11ed-a1eb-0242ac120002', 'b698d633-a946-4639-8e40-eb59fbb1be06');
INSERT INTO public.role_permission VALUES ('6a0ee1be-7352-11ed-a1eb-0242ac120002', 'c7ee301c-d4e7-4203-bee3-dd899955de34');
INSERT INTO public.role_permission VALUES ('6a0ee1be-7352-11ed-a1eb-0242ac120002', '23cb2236-3e0c-485b-b25b-96fc602ce3e9');
INSERT INTO public.role_permission VALUES ('6a0ee1be-7352-11ed-a1eb-0242ac120002', '4858cb0e-ce04-4109-97c8-e5c222e85c4e');
INSERT INTO public.role_permission VALUES ('6a0ee1be-7352-11ed-a1eb-0242ac120002', '3658ea1d-abc9-4bda-bcf1-a2d545add52a');
INSERT INTO public.role_permission VALUES ('6a0ee1be-7352-11ed-a1eb-0242ac120002', '65b00329-95e2-48ab-a46b-3f8ff9ccef3e');
INSERT INTO public.role_permission VALUES ('6a0ee1be-7352-11ed-a1eb-0242ac120002', 'b926991d-2e58-4e6a-b353-c5e6588a50b6');
INSERT INTO public.role_permission VALUES ('6a0ee1be-7352-11ed-a1eb-0242ac120002', '453ea183-3e8a-4c87-9359-2f06b7c88717');
INSERT INTO public.role_permission VALUES ('6a0ee1be-7352-11ed-a1eb-0242ac120002', 'f6fefced-4a95-41a1-b1a8-3d046f2b7df1');
INSERT INTO public.role_permission VALUES ('6a0ee1be-7352-11ed-a1eb-0242ac120002', '61936b2d-e589-4acc-8142-981dcbc05127');
INSERT INTO public.role_permission VALUES ('6a0ee1be-7352-11ed-a1eb-0242ac120002', '52643a20-817d-4a18-b5c9-4ab9e90eaf26');
INSERT INTO public.role_permission VALUES ('6a0ee1be-7352-11ed-a1eb-0242ac120002', 'f4ddef64-1a74-49e2-b3e1-63bcc7ff2901');
INSERT INTO public.role_permission VALUES ('6a0ee1be-7352-11ed-a1eb-0242ac120002', '323f408b-352f-4edc-9623-9198db8208ae');
INSERT INTO public.role_permission VALUES ('6a0ee1be-7352-11ed-a1eb-0242ac120002', '123c8d0d-2292-4df6-bc61-e584d944b710');
INSERT INTO public.role_permission VALUES ('6a0ee1be-7352-11ed-a1eb-0242ac120002', 'f57acd80-355d-4274-a096-683e6a211702');
INSERT INTO public.role_permission VALUES ('6a0ee1be-7352-11ed-a1eb-0242ac120002', '3887c8ca-a96b-444d-9154-94c4ce779cba');
INSERT INTO public.role_permission VALUES ('6a0ee1be-7352-11ed-a1eb-0242ac120002', '0aa3b65d-a676-407a-b05a-ab6d5318df41');
INSERT INTO public.role_permission VALUES ('6a0ee1be-7352-11ed-a1eb-0242ac120002', '87175d35-5088-4a6b-8933-537047fb1147');
INSERT INTO public.role_permission VALUES ('6a0ee1be-7352-11ed-a1eb-0242ac120002', 'c403121a-ad6f-4b84-b1dc-b3be73e668d1');
INSERT INTO public.role_permission VALUES ('6a0ee1be-7352-11ed-a1eb-0242ac120002', '0c883145-d404-40d2-aeef-847de7c5828c');
INSERT INTO public.role_permission VALUES ('6a0ee1be-7352-11ed-a1eb-0242ac120002', 'f2a62b08-1efb-4fb7-ac8c-4c83ef6a77e9');


-- Permissions of ADMINISTRATOR
INSERT INTO public.role_permission VALUES ('c8e583b6-0591-47b4-bd4c-12f3811ebbea', '23cb2236-3e0c-485b-b25b-96fc602ce3e9');
INSERT INTO public.role_permission VALUES ('c8e583b6-0591-47b4-bd4c-12f3811ebbea', '4858cb0e-ce04-4109-97c8-e5c222e85c4e');
INSERT INTO public.role_permission VALUES ('c8e583b6-0591-47b4-bd4c-12f3811ebbea', '3658ea1d-abc9-4bda-bcf1-a2d545add52a');
INSERT INTO public.role_permission VALUES ('c8e583b6-0591-47b4-bd4c-12f3811ebbea', '65b00329-95e2-48ab-a46b-3f8ff9ccef3e');
INSERT INTO public.role_permission VALUES ('c8e583b6-0591-47b4-bd4c-12f3811ebbea', 'b926991d-2e58-4e6a-b353-c5e6588a50b6');
INSERT INTO public.role_permission VALUES ('c8e583b6-0591-47b4-bd4c-12f3811ebbea', '323f408b-352f-4edc-9623-9198db8208ae');
INSERT INTO public.role_permission VALUES ('c8e583b6-0591-47b4-bd4c-12f3811ebbea', '123c8d0d-2292-4df6-bc61-e584d944b710');
INSERT INTO public.role_permission VALUES ('c8e583b6-0591-47b4-bd4c-12f3811ebbea', 'f57acd80-355d-4274-a096-683e6a211702');
INSERT INTO public.role_permission VALUES ('c8e583b6-0591-47b4-bd4c-12f3811ebbea', '0aa3b65d-a676-407a-b05a-ab6d5318df41');
INSERT INTO public.role_permission VALUES ('c8e583b6-0591-47b4-bd4c-12f3811ebbea', '87175d35-5088-4a6b-8933-537047fb1147');
INSERT INTO public.role_permission VALUES ('c8e583b6-0591-47b4-bd4c-12f3811ebbea', 'c403121a-ad6f-4b84-b1dc-b3be73e668d1');
INSERT INTO public.role_permission VALUES ('c8e583b6-0591-47b4-bd4c-12f3811ebbea', '0c883145-d404-40d2-aeef-847de7c5828c');
INSERT INTO public.role_permission VALUES ('c8e583b6-0591-47b4-bd4c-12f3811ebbea', 'f2a62b08-1efb-4fb7-ac8c-4c83ef6a77e9');


-- Permissions of TOY_MAKING_COORDINATOR
INSERT INTO public.role_permission VALUES ('56636955-f72d-4e62-92bf-5e00c7cfd3d8', '0aa3b65d-a676-407a-b05a-ab6d5318df41');
INSERT INTO public.role_permission VALUES ('56636955-f72d-4e62-92bf-5e00c7cfd3d8', 'c403121a-ad6f-4b84-b1dc-b3be73e668d1');
INSERT INTO public.role_permission VALUES ('56636955-f72d-4e62-92bf-5e00c7cfd3d8', '0c883145-d404-40d2-aeef-847de7c5828c');
INSERT INTO public.role_permission VALUES ('56636955-f72d-4e62-92bf-5e00c7cfd3d8', 'f2a62b08-1efb-4fb7-ac8c-4c83ef6a77e9');

-- Permissions of FAIRY_PAINTING_COORDINATOR
INSERT INTO public.role_permission VALUES ('c8f06889-eda6-4da2-8e22-7aa3394ab0a7', '0aa3b65d-a676-407a-b05a-ab6d5318df41');
INSERT INTO public.role_permission VALUES ('c8f06889-eda6-4da2-8e22-7aa3394ab0a7', 'c403121a-ad6f-4b84-b1dc-b3be73e668d1');
INSERT INTO public.role_permission VALUES ('c8f06889-eda6-4da2-8e22-7aa3394ab0a7', '0c883145-d404-40d2-aeef-847de7c5828c');
INSERT INTO public.role_permission VALUES ('c8f06889-eda6-4da2-8e22-7aa3394ab0a7', 'f2a62b08-1efb-4fb7-ac8c-4c83ef6a77e9');

-- Permissions of HOSPITAL_VISIT_COORDINATOR
INSERT INTO public.role_permission VALUES ('f16a36e3-4d0e-4577-a80b-a78f94f3467c', 'c7ee301c-d4e7-4203-bee3-dd899955de34');
INSERT INTO public.role_permission VALUES ('f16a36e3-4d0e-4577-a80b-a78f94f3467c', '23cb2236-3e0c-485b-b25b-96fc602ce3e9');
INSERT INTO public.role_permission VALUES ('f16a36e3-4d0e-4577-a80b-a78f94f3467c', '4858cb0e-ce04-4109-97c8-e5c222e85c4e');
INSERT INTO public.role_permission VALUES ('f16a36e3-4d0e-4577-a80b-a78f94f3467c', '3658ea1d-abc9-4bda-bcf1-a2d545add52a');
INSERT INTO public.role_permission VALUES ('f16a36e3-4d0e-4577-a80b-a78f94f3467c', '65b00329-95e2-48ab-a46b-3f8ff9ccef3e');
INSERT INTO public.role_permission VALUES ('f16a36e3-4d0e-4577-a80b-a78f94f3467c', 'b926991d-2e58-4e6a-b353-c5e6588a50b6');
INSERT INTO public.role_permission VALUES ('f16a36e3-4d0e-4577-a80b-a78f94f3467c', '453ea183-3e8a-4c87-9359-2f06b7c88717');
INSERT INTO public.role_permission VALUES ('f16a36e3-4d0e-4577-a80b-a78f94f3467c', 'f6fefced-4a95-41a1-b1a8-3d046f2b7df1');
INSERT INTO public.role_permission VALUES ('f16a36e3-4d0e-4577-a80b-a78f94f3467c', '61936b2d-e589-4acc-8142-981dcbc05127');
INSERT INTO public.role_permission VALUES ('f16a36e3-4d0e-4577-a80b-a78f94f3467c', 'f4ddef64-1a74-49e2-b3e1-63bcc7ff2901');
INSERT INTO public.role_permission VALUES ('f16a36e3-4d0e-4577-a80b-a78f94f3467c', '323f408b-352f-4edc-9623-9198db8208ae');
INSERT INTO public.role_permission VALUES ('f16a36e3-4d0e-4577-a80b-a78f94f3467c', '0aa3b65d-a676-407a-b05a-ab6d5318df41');
INSERT INTO public.role_permission VALUES ('f16a36e3-4d0e-4577-a80b-a78f94f3467c', '87175d35-5088-4a6b-8933-537047fb1147');
INSERT INTO public.role_permission VALUES ('f16a36e3-4d0e-4577-a80b-a78f94f3467c', 'c403121a-ad6f-4b84-b1dc-b3be73e668d1');
INSERT INTO public.role_permission VALUES ('f16a36e3-4d0e-4577-a80b-a78f94f3467c', '0c883145-d404-40d2-aeef-847de7c5828c');
INSERT INTO public.role_permission VALUES ('f16a36e3-4d0e-4577-a80b-a78f94f3467c', 'f2a62b08-1efb-4fb7-ac8c-4c83ef6a77e9');


-- Permissions of MENTOR_HOSPITAL_VISITOR
INSERT INTO public.role_permission VALUES ('075854d2-3fc6-4da5-b279-58bbf2603143', 'b698d633-a946-4639-8e40-eb59fbb1be06');
INSERT INTO public.role_permission VALUES ('075854d2-3fc6-4da5-b279-58bbf2603143', 'c7ee301c-d4e7-4203-bee3-dd899955de34');
INSERT INTO public.role_permission VALUES ('075854d2-3fc6-4da5-b279-58bbf2603143', '4858cb0e-ce04-4109-97c8-e5c222e85c4e');
INSERT INTO public.role_permission VALUES ('075854d2-3fc6-4da5-b279-58bbf2603143', '3658ea1d-abc9-4bda-bcf1-a2d545add52a');
INSERT INTO public.role_permission VALUES ('075854d2-3fc6-4da5-b279-58bbf2603143', '65b00329-95e2-48ab-a46b-3f8ff9ccef3e');
INSERT INTO public.role_permission VALUES ('075854d2-3fc6-4da5-b279-58bbf2603143', 'b926991d-2e58-4e6a-b353-c5e6588a50b6');
INSERT INTO public.role_permission VALUES ('075854d2-3fc6-4da5-b279-58bbf2603143', 'f6fefced-4a95-41a1-b1a8-3d046f2b7df1');
INSERT INTO public.role_permission VALUES ('075854d2-3fc6-4da5-b279-58bbf2603143', '61936b2d-e589-4acc-8142-981dcbc05127');
INSERT INTO public.role_permission VALUES ('075854d2-3fc6-4da5-b279-58bbf2603143', '52643a20-817d-4a18-b5c9-4ab9e90eaf26');
INSERT INTO public.role_permission VALUES ('075854d2-3fc6-4da5-b279-58bbf2603143', 'f4ddef64-1a74-49e2-b3e1-63bcc7ff2901');
INSERT INTO public.role_permission VALUES ('075854d2-3fc6-4da5-b279-58bbf2603143', '0aa3b65d-a676-407a-b05a-ab6d5318df41');
INSERT INTO public.role_permission VALUES ('075854d2-3fc6-4da5-b279-58bbf2603143', '0c883145-d404-40d2-aeef-847de7c5828c');

-- Permissions of HOSPITAL_VISITOR
INSERT INTO public.role_permission VALUES ('d0ce265b-1241-4914-a551-3686640c00da', 'b698d633-a946-4639-8e40-eb59fbb1be06');
INSERT INTO public.role_permission VALUES ('d0ce265b-1241-4914-a551-3686640c00da', 'c7ee301c-d4e7-4203-bee3-dd899955de34');
INSERT INTO public.role_permission VALUES ('d0ce265b-1241-4914-a551-3686640c00da', '4858cb0e-ce04-4109-97c8-e5c222e85c4e');
INSERT INTO public.role_permission VALUES ('d0ce265b-1241-4914-a551-3686640c00da', '3658ea1d-abc9-4bda-bcf1-a2d545add52a');
INSERT INTO public.role_permission VALUES ('d0ce265b-1241-4914-a551-3686640c00da', '65b00329-95e2-48ab-a46b-3f8ff9ccef3e');
INSERT INTO public.role_permission VALUES ('d0ce265b-1241-4914-a551-3686640c00da', 'b926991d-2e58-4e6a-b353-c5e6588a50b6');
INSERT INTO public.role_permission VALUES ('d0ce265b-1241-4914-a551-3686640c00da', 'f6fefced-4a95-41a1-b1a8-3d046f2b7df1');
INSERT INTO public.role_permission VALUES ('d0ce265b-1241-4914-a551-3686640c00da', '61936b2d-e589-4acc-8142-981dcbc05127');
INSERT INTO public.role_permission VALUES ('d0ce265b-1241-4914-a551-3686640c00da', '52643a20-817d-4a18-b5c9-4ab9e90eaf26');
INSERT INTO public.role_permission VALUES ('d0ce265b-1241-4914-a551-3686640c00da', 'f4ddef64-1a74-49e2-b3e1-63bcc7ff2901');
INSERT INTO public.role_permission VALUES ('d0ce265b-1241-4914-a551-3686640c00da', '0aa3b65d-a676-407a-b05a-ab6d5318df41');
INSERT INTO public.role_permission VALUES ('d0ce265b-1241-4914-a551-3686640c00da', '0c883145-d404-40d2-aeef-847de7c5828c');

-- Permissions of BEGINNER_HOSPITAL_VISITOR
INSERT INTO public.role_permission VALUES ('9b81259f-8f84-4f7e-939a-6b94fe896623', 'b698d633-a946-4639-8e40-eb59fbb1be06');
INSERT INTO public.role_permission VALUES ('9b81259f-8f84-4f7e-939a-6b94fe896623', 'c7ee301c-d4e7-4203-bee3-dd899955de34');
INSERT INTO public.role_permission VALUES ('9b81259f-8f84-4f7e-939a-6b94fe896623', '4858cb0e-ce04-4109-97c8-e5c222e85c4e');
INSERT INTO public.role_permission VALUES ('9b81259f-8f84-4f7e-939a-6b94fe896623', '3658ea1d-abc9-4bda-bcf1-a2d545add52a');
INSERT INTO public.role_permission VALUES ('9b81259f-8f84-4f7e-939a-6b94fe896623', '65b00329-95e2-48ab-a46b-3f8ff9ccef3e');
INSERT INTO public.role_permission VALUES ('9b81259f-8f84-4f7e-939a-6b94fe896623', 'b926991d-2e58-4e6a-b353-c5e6588a50b6');
INSERT INTO public.role_permission VALUES ('9b81259f-8f84-4f7e-939a-6b94fe896623', 'f6fefced-4a95-41a1-b1a8-3d046f2b7df1');
INSERT INTO public.role_permission VALUES ('9b81259f-8f84-4f7e-939a-6b94fe896623', '61936b2d-e589-4acc-8142-981dcbc05127');
INSERT INTO public.role_permission VALUES ('9b81259f-8f84-4f7e-939a-6b94fe896623', '52643a20-817d-4a18-b5c9-4ab9e90eaf26');
INSERT INTO public.role_permission VALUES ('9b81259f-8f84-4f7e-939a-6b94fe896623', 'f4ddef64-1a74-49e2-b3e1-63bcc7ff2901');
INSERT INTO public.role_permission VALUES ('9b81259f-8f84-4f7e-939a-6b94fe896623', '0aa3b65d-a676-407a-b05a-ab6d5318df41');
INSERT INTO public.role_permission VALUES ('9b81259f-8f84-4f7e-939a-6b94fe896623', '0c883145-d404-40d2-aeef-847de7c5828c');

-- Permissions of INTERN_HOSPITAL_VISITOR
INSERT INTO public.role_permission VALUES ('255cb664-b9e4-4d29-bce2-43d79108aaf1', 'c7ee301c-d4e7-4203-bee3-dd899955de34');
INSERT INTO public.role_permission VALUES ('255cb664-b9e4-4d29-bce2-43d79108aaf1', '4858cb0e-ce04-4109-97c8-e5c222e85c4e');
INSERT INTO public.role_permission VALUES ('255cb664-b9e4-4d29-bce2-43d79108aaf1', '3658ea1d-abc9-4bda-bcf1-a2d545add52a');
INSERT INTO public.role_permission VALUES ('255cb664-b9e4-4d29-bce2-43d79108aaf1', 'b926991d-2e58-4e6a-b353-c5e6588a50b6');
INSERT INTO public.role_permission VALUES ('255cb664-b9e4-4d29-bce2-43d79108aaf1', 'f6fefced-4a95-41a1-b1a8-3d046f2b7df1');
INSERT INTO public.role_permission VALUES ('255cb664-b9e4-4d29-bce2-43d79108aaf1', 'f4ddef64-1a74-49e2-b3e1-63bcc7ff2901');
INSERT INTO public.role_permission VALUES ('255cb664-b9e4-4d29-bce2-43d79108aaf1', '0aa3b65d-a676-407a-b05a-ab6d5318df41');
INSERT INTO public.role_permission VALUES ('255cb664-b9e4-4d29-bce2-43d79108aaf1', '0c883145-d404-40d2-aeef-847de7c5828c');
