CREATE TABLE public.certificate (
    id uuid NOT NULL,
    owner_id uuid NOT NULL,
    datetime timestamp without time zone NOT NULL,
    type text NOT NULL,
    added_by_id uuid
);

CREATE TABLE public.child_patient (
    id uuid NOT NULL,
    name text NOT NULL,
    guessed_birth text NOT NULL,
    info text
);

CREATE TABLE public.general_event (
    id uuid NOT NULL,
    organizer_id uuid NOT NULL,
    datetime_from timestamp without time zone NOT NULL,
    datetime_to timestamp without time zone NOT NULL,
    counted_minutes integer,
    visibility text NOT NULL,
    name text NOT NULL,
    address text NOT NULL,
    brief text,
    people_limit integer DEFAULT 15,
    can_user_apply boolean DEFAULT true,
    type text NOT NULL
);

CREATE TABLE public.hospital_box_status_report (
    id uuid NOT NULL,
    visit_id uuid,
    hospital_department_id uuid NOT NULL,
    date_time timestamp without time zone NOT NULL,
    reason text NOT NULL,
    affected_object text,
    comment text
);

CREATE TABLE public.hospital_department (
    id uuid NOT NULL,
    name text NOT NULL,
    valid_from timestamp without time zone NOT NULL,
    valid_to timestamp without time zone NOT NULL,
    address text NOT NULL,
    diseases_info text,
    note text
);

CREATE TABLE public.hospital_visit (
    id uuid NOT NULL,
    organizer_id uuid NOT NULL,
    datetime_from timestamp without time zone NOT NULL,
    datetime_to timestamp without time zone NOT NULL,
    counted_minutes integer,
    visibility text NOT NULL,
    department_id uuid NOT NULL,
    status text NOT NULL
);

CREATE TABLE public.hospital_visit_tmp (
    id uuid NOT NULL,
    visit_id uuid NOT NULL,
    "key" text NOT NULL,
    value jsonb
);

CREATE TABLE public.hospital_visit_activity (
    id uuid NOT NULL,
    hospital_visit_id uuid NOT NULL,
    children jsonb NOT NULL,
    activities jsonb NOT NULL,
    comment text
);

CREATE TABLE public.hospital_visit_action (
    id uuid NOT NULL,
    hospital_visit_id uuid NOT NULL,
    type text NOT NULL,
    params json,
    added_by uuid NOT NULL,
    date_time timestamp without time zone NOT NULL
);

CREATE TABLE public.hospital_visit_participant (
    person_id uuid NOT NULL,
    event_id uuid NOT NULL
);

CREATE TABLE public.event_participant (
    person_id uuid NOT NULL,
    event_id uuid NOT NULL
);

CREATE TABLE public.notification (
    id uuid NOT NULL,
    person_id uuid NOT NULL,
    type text NOT NULL,
    params json,
    created timestamp without time zone NOT NULL,
    seen boolean NOT NULL
);

CREATE TABLE public.person (
    id uuid NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    nick_name text,
    preferences jsonb,
    phone text,
    email text
);

CREATE TABLE public."user" (
    id uuid NOT NULL,
    person_id uuid NOT NULL,
    username text NOT NULL,
    password text NOT NULL,
    is_active boolean,
    custom_info json
);

CREATE TABLE public.user_role (
    user_id uuid NOT NULL,
    role_id uuid NOT NULL
);

CREATE TABLE public.role (
    id uuid NOT NULL,
    role text NOT NULL
);

CREATE TABLE public.visit_personal_report (
    id uuid NOT NULL,
    modified_at timestamp without time zone NOT NULL,
    hospital_visit_id uuid NOT NULL,
    person_id uuid NOT NULL,
    report text NOT NULL,
    status text NOT NULL
);

CREATE TABLE public.visit_personal_report_answer (
    id uuid NOT NULL,
    visit_personal_report_id uuid NOT NULL,
    modified_at timestamp without time zone NOT NULL,
    person_id uuid NOT NULL,
    comment text NOT NULL
);

CREATE TABLE public.volunteering_time (
    id uuid NOT NULL,
    person_id uuid NOT NULL,
    minutes integer NOT NULL,
    event_id uuid,
    visit_id uuid
);

CREATE TABLE public.volunteering_type (
    person_id uuid NOT NULL,
    type text NOT NULL
);


ALTER TABLE ONLY public.certificate
    ADD CONSTRAINT certificate__id__primary_key PRIMARY KEY (id);

ALTER TABLE ONLY public.child_patient
    ADD CONSTRAINT child_patient__id__primary_key PRIMARY KEY (id);

ALTER TABLE ONLY public.general_event
    ADD CONSTRAINT general_event__id__primary_key PRIMARY KEY (id);

ALTER TABLE ONLY public.hospital_box_status_report
    ADD CONSTRAINT hospital_box_status_report__id__primary_key PRIMARY KEY (id);

ALTER TABLE ONLY public.hospital_department
    ADD CONSTRAINT hospital_department__id__primary_key PRIMARY KEY (id);

ALTER TABLE ONLY public.hospital_visit
    ADD CONSTRAINT hospital_visit__id__primary_key PRIMARY KEY (id);

ALTER TABLE ONLY public.hospital_visit_activity
    ADD CONSTRAINT hospital_visit_activity__id__primary_key PRIMARY KEY (id);

ALTER TABLE ONLY public.hospital_visit_action
    ADD CONSTRAINT hospital_visit_action__id__primary_key PRIMARY KEY (id);

ALTER TABLE ONLY public.event_participant
    ADD CONSTRAINT event_participant_pkey PRIMARY KEY (person_id, event_id);

ALTER TABLE ONLY public.hospital_visit_participant
    ADD CONSTRAINT hospital_visit_participant_pkey PRIMARY KEY (person_id, event_id);

ALTER TABLE ONLY public.notification
    ADD CONSTRAINT notification__id__primary_key PRIMARY KEY (id);

ALTER TABLE ONLY public.person
    ADD CONSTRAINT people__id__primary_key PRIMARY KEY (id);

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user__id__primary_key PRIMARY KEY (id);

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role__id__pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.visit_personal_report
    ADD CONSTRAINT visit_personal_report__id__primary_key PRIMARY KEY (id);

ALTER TABLE ONLY public.visit_personal_report_answer
    ADD CONSTRAINT visit_personal_report_answer__id__primary_key PRIMARY KEY (id);

ALTER TABLE ONLY public.volunteering_time
    ADD CONSTRAINT volunteering_time__id_primary_key PRIMARY KEY (id);

ALTER TABLE ONLY public.volunteering_type
    ADD CONSTRAINT volunteering_type_pkey PRIMARY KEY (person_id, type);

ALTER TABLE ONLY public.hospital_visit_tmp
    ADD CONSTRAINT hospital_visit_tmp_pkey PRIMARY KEY (id, visit_id, "key");

ALTER TABLE ONLY public.certificate
    ADD CONSTRAINT certificate__added_by_id__to__person__id FOREIGN KEY (added_by_id) REFERENCES public.person(id);

ALTER TABLE ONLY public.certificate
    ADD CONSTRAINT certificate__owner_id__to__person__id FOREIGN KEY (owner_id) REFERENCES public.person(id);

ALTER TABLE ONLY public.hospital_visit
    ADD CONSTRAINT event__organizer_id__to__person_id FOREIGN KEY (organizer_id) REFERENCES public.person(id);

ALTER TABLE ONLY public.general_event
    ADD CONSTRAINT event__organizer_id__to__person_id FOREIGN KEY (organizer_id) REFERENCES public.person(id);

ALTER TABLE ONLY public.hospital_visit_tmp
    ADD CONSTRAINT hospital_visit_tmp__visit_id__to__visit__id FOREIGN KEY (visit_id) REFERENCES public.hospital_visit(id);

ALTER TABLE ONLY public.hospital_box_status_report
    ADD CONSTRAINT hospital_box_status_report__hospital_department_id__to__hospita FOREIGN KEY (hospital_department_id) REFERENCES public.hospital_department(id);

ALTER TABLE ONLY public.hospital_box_status_report
    ADD CONSTRAINT hospital_box_status_report__visit_id__to__hospita FOREIGN KEY (visit_id) REFERENCES public.hospital_visit(id);

ALTER TABLE ONLY public.hospital_visit
    ADD CONSTRAINT hospital_visit__department_id__to__hospital_department__id FOREIGN KEY (department_id) REFERENCES public.hospital_department(id);

ALTER TABLE ONLY public.hospital_visit_activity
    ADD CONSTRAINT visit_activity__hospital_visit_id__to__hospital_visit__id FOREIGN KEY (hospital_visit_id) REFERENCES public.hospital_visit(id);

ALTER TABLE ONLY public.hospital_visit_action
    ADD CONSTRAINT visit_action__visit_id__to__hospital_visit_id FOREIGN KEY (hospital_visit_id) REFERENCES public.hospital_visit(id);

ALTER TABLE ONLY public.hospital_visit_participant
    ADD CONSTRAINT visit_participant__person_id__to_person_id FOREIGN KEY (person_id) REFERENCES public.person(id);

ALTER TABLE ONLY public.hospital_visit_participant
    ADD CONSTRAINT visit_participant__visit_id__to_event_id FOREIGN KEY (event_id) REFERENCES public.hospital_visit(id);

ALTER TABLE ONLY public.event_participant
    ADD CONSTRAINT event_participant__person_id__to_person_id FOREIGN KEY (person_id) REFERENCES public.person(id);

ALTER TABLE ONLY public.event_participant
    ADD CONSTRAINT event_participant__visit_id__to_event_id FOREIGN KEY (event_id) REFERENCES public.general_event(id);

ALTER TABLE ONLY public.notification
    ADD CONSTRAINT notification__person_id__to__person__id FOREIGN KEY (person_id) REFERENCES public.person(id);

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user__person_id__to__person__id FOREIGN KEY (person_id) REFERENCES public.person(id);

ALTER TABLE ONLY public.user_role
    ADD CONSTRAINT user_role__user_id__to__user__id FOREIGN KEY (user_id) REFERENCES public."user"(id) NOT VALID;

ALTER TABLE ONLY public.user_role
    ADD CONSTRAINT user_role__role_id__to__role__id FOREIGN KEY (role_id) REFERENCES public.role(id) NOT VALID;

ALTER TABLE ONLY public.visit_personal_report
    ADD CONSTRAINT visit_personal_report__person_id__to__person__id FOREIGN KEY (person_id) REFERENCES public.person(id);

ALTER TABLE ONLY public.visit_personal_report_answer
    ADD CONSTRAINT report_answer__person_id__to__visit_personal_report__id FOREIGN KEY (visit_personal_report_id) REFERENCES public.visit_personal_report(id);

ALTER TABLE ONLY public.visit_personal_report_answer
    ADD CONSTRAINT visit_personal_report_answer__person_id__to__person__id FOREIGN KEY (person_id) REFERENCES public.person(id);

ALTER TABLE ONLY public.visit_personal_report
    ADD CONSTRAINT visit_personal_report__visit_id__to__hospital_visit__id FOREIGN KEY (hospital_visit_id) REFERENCES public.hospital_visit(id);

ALTER TABLE ONLY public.volunteering_time
    ADD CONSTRAINT volunteering_time__visit_id__to__event__id FOREIGN KEY (event_id) REFERENCES public.hospital_visit(id);

ALTER TABLE ONLY public.volunteering_time
    ADD CONSTRAINT volunteering_time__event_id__to__event__id FOREIGN KEY (event_id) REFERENCES public.general_event(id);

ALTER TABLE ONLY public.volunteering_time
    ADD CONSTRAINT volunteering_time__person_id__to__person__id FOREIGN KEY (person_id) REFERENCES public.person(id);

ALTER TABLE ONLY public.volunteering_type
    ADD CONSTRAINT volunteering_type__person_id__to__person__id FOREIGN KEY (person_id) REFERENCES public.person(id);


INSERT INTO public.role VALUES ('255cb664-b9e4-4d29-bce2-43d79108aaf1', 'INTERN_HOSPITAL_VISITOR');
INSERT INTO public.role VALUES ('9b81259f-8f84-4f7e-939a-6b94fe896623', 'BEGINNER_HOSPITAL_VISITOR');
INSERT INTO public.role VALUES ('d0ce265b-1241-4914-a551-3686640c00da', 'HOSPITAL_VISITOR');
INSERT INTO public.role VALUES ('075854d2-3fc6-4da5-b279-58bbf2603143', 'MENTOR_HOSPITAL_VISITOR');
INSERT INTO public.role VALUES ('f16a36e3-4d0e-4577-a80b-a78f94f3467c', 'HOSPITAL_VISIT_COORDINATOR');
INSERT INTO public.role VALUES ('c8f06889-eda6-4da2-8e22-7aa3394ab0a7', 'FAIRY_PAINTING_COORDINATOR');
INSERT INTO public.role VALUES ('56636955-f72d-4e62-92bf-5e00c7cfd3d8', 'TOY_MAKING_COORDINATOR');
INSERT INTO public.role VALUES ('c8e583b6-0591-47b4-bd4c-12f3811ebbea', 'ADMINISTRATOR');
INSERT INTO public.role VALUES ('6a0ee1be-7352-11ed-a1eb-0242ac120002', 'SYSADMIN');
