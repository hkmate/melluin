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
    birth_year integer NOT NULL,
    info text
);

CREATE TABLE public.event (
    id uuid NOT NULL,
    organizer_id uuid NOT NULL,
    datetime_from timestamp without time zone NOT NULL,
    datetime_to timestamp without time zone NOT NULL,
    counted_hours integer
);

CREATE TABLE public.general_event (
    id uuid NOT NULL,
    event_id uuid NOT NULL,
    name text NOT NULL,
    address text NOT NULL,
    brief text,
    people_limit integer DEFAULT 15,
    can_user_apply boolean DEFAULT true,
    type text NOT NULL
);

CREATE TABLE public.hospital_box_status_report (
    id uuid NOT NULL,
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
    address text NOT NULL
);

CREATE TABLE public.hospital_visit (
    id uuid NOT NULL,
    department_id uuid NOT NULL,
    status text NOT NULL,
    event_id uuid NOT NULL
);

CREATE TABLE public.hospital_visit_action (
    id uuid NOT NULL,
    hospital_visit_id uuid NOT NULL,
    child_patient_id uuid NOT NULL,
    action_type text NOT NULL,
    comment text,
    in_group boolean,
    is_parent_there boolean
);

CREATE TABLE public.hospital_visit_history (
    id uuid NOT NULL,
    hospital_visit_id uuid NOT NULL,
    type text NOT NULL,
    params json,
    added_by uuid NOT NULL,
    date_time timestamp without time zone NOT NULL
);

CREATE TABLE public.hospital_visitor (
    person_id uuid NOT NULL,
    hospital_visit_id uuid NOT NULL
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
    phone text,
    email text
);

CREATE TABLE public."user" (
    id uuid NOT NULL,
    person_id uuid NOT NULL,
    password text,
    enable boolean
);

CREATE TABLE public.user_role (
    user_id uuid NOT NULL,
    role text NOT NULL
);

CREATE TABLE public.visit_personal_report (
    id uuid NOT NULL,
    hospital_visit_id uuid NOT NULL,
    reporter_id uuid NOT NULL,
    report text NOT NULL,
    coordinator_id uuid,
    coordinator_answer text
);

CREATE TABLE public.volunteering_time (
    id uuid NOT NULL,
    person_id uuid NOT NULL,
    minutes integer NOT NULL,
    event_id uuid NOT NULL
);

CREATE TABLE public.volunteering_type (
    person_id uuid NOT NULL,
    type text NOT NULL
);


ALTER TABLE ONLY public.certificate
    ADD CONSTRAINT certificate__id__primary_key PRIMARY KEY (id);

ALTER TABLE ONLY public.child_patient
    ADD CONSTRAINT child_patient__id__primary_key PRIMARY KEY (id);

ALTER TABLE ONLY public.event
    ADD CONSTRAINT event__id__primary_key PRIMARY KEY (id);

ALTER TABLE ONLY public.general_event
    ADD CONSTRAINT general_event__id__primary_key PRIMARY KEY (id);

ALTER TABLE ONLY public.hospital_box_status_report
    ADD CONSTRAINT hospital_box_status_report__id__primary_key PRIMARY KEY (id);

ALTER TABLE ONLY public.hospital_department
    ADD CONSTRAINT hospital_department__id__primary_key PRIMARY KEY (id);

ALTER TABLE ONLY public.hospital_visit
    ADD CONSTRAINT hospital_visit__id__primary_key PRIMARY KEY (id);

ALTER TABLE ONLY public.hospital_visit_action
    ADD CONSTRAINT hospital_visit_action__id__primary_key PRIMARY KEY (id);

ALTER TABLE ONLY public.hospital_visit_history
    ADD CONSTRAINT hospital_visit_history__id__primary_key PRIMARY KEY (id);

ALTER TABLE ONLY public.hospital_visitor
    ADD CONSTRAINT hospital_visitor_pkey PRIMARY KEY (person_id, hospital_visit_id);

ALTER TABLE ONLY public.notification
    ADD CONSTRAINT notification__id__primary_key PRIMARY KEY (id);

ALTER TABLE ONLY public.person
    ADD CONSTRAINT people__id__primary_key PRIMARY KEY (id);

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user__id__primary_key PRIMARY KEY (id);

ALTER TABLE ONLY public.user_role
    ADD CONSTRAINT user_role_pkey PRIMARY KEY (user_id, role);

ALTER TABLE ONLY public.visit_personal_report
    ADD CONSTRAINT visit_personal_report__id__primary_key PRIMARY KEY (id);

ALTER TABLE ONLY public.volunteering_time
    ADD CONSTRAINT volunteering_time__id_primary_key PRIMARY KEY (id);

ALTER TABLE ONLY public.volunteering_type
    ADD CONSTRAINT volunteering_type_pkey PRIMARY KEY (person_id, type);

ALTER TABLE ONLY public.certificate
    ADD CONSTRAINT certificate__added_by_id__to__person__id FOREIGN KEY (added_by_id) REFERENCES public.person(id);

ALTER TABLE ONLY public.certificate
    ADD CONSTRAINT certificate__owner_id__to__person__id FOREIGN KEY (owner_id) REFERENCES public.person(id);

ALTER TABLE ONLY public.event
    ADD CONSTRAINT event__organizer_id__to__pesron_id FOREIGN KEY (organizer_id) REFERENCES public.person(id);

ALTER TABLE ONLY public.general_event
    ADD CONSTRAINT general_event__event_id__to__event__id FOREIGN KEY (event_id) REFERENCES public.event(id);

ALTER TABLE ONLY public.hospital_box_status_report
    ADD CONSTRAINT hospital_box_status_report__hospital_department_id__to__hospita FOREIGN KEY (hospital_department_id) REFERENCES public.hospital_department(id);

ALTER TABLE ONLY public.hospital_visit
    ADD CONSTRAINT hospital_visit__department_id__to__hospital_department__id FOREIGN KEY (department_id) REFERENCES public.hospital_department(id);

ALTER TABLE ONLY public.hospital_visit
    ADD CONSTRAINT hospital_visit__event_id__to__event__id FOREIGN KEY (event_id) REFERENCES public.event(id) NOT VALID;

ALTER TABLE ONLY public.hospital_visit_action
    ADD CONSTRAINT hospital_visit_action__child_patient_id__to__child_patient__id FOREIGN KEY (child_patient_id) REFERENCES public.child_patient(id);

ALTER TABLE ONLY public.hospital_visit_action
    ADD CONSTRAINT hospital_visit_action__hospital_visit_id__to__hospital_visit__i FOREIGN KEY (hospital_visit_id) REFERENCES public.hospital_visit(id);

ALTER TABLE ONLY public.hospital_visit_history
    ADD CONSTRAINT hospital_visit_history__visit_id__to__hospital_visit_id FOREIGN KEY (hospital_visit_id) REFERENCES public.hospital_visit(id);

ALTER TABLE ONLY public.hospital_visitor
    ADD CONSTRAINT hospital_visitor__person_id__to_person_id FOREIGN KEY (person_id) REFERENCES public.person(id);

ALTER TABLE ONLY public.hospital_visitor
    ADD CONSTRAINT hospital_visitor__visit_id__to_hospital_visit_id FOREIGN KEY (hospital_visit_id) REFERENCES public.hospital_visit(id);

ALTER TABLE ONLY public.notification
    ADD CONSTRAINT notification__person_id__to__person__id FOREIGN KEY (person_id) REFERENCES public.person(id);

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user__person_id__to__person__id FOREIGN KEY (person_id) REFERENCES public.person(id);

ALTER TABLE ONLY public.user_role
    ADD CONSTRAINT user_role__user_id__to__user__id FOREIGN KEY (user_id) REFERENCES public."user"(id) NOT VALID;

ALTER TABLE ONLY public.visit_personal_report
    ADD CONSTRAINT visit_personal_report__coordinator_id__to__person__id FOREIGN KEY (coordinator_id) REFERENCES public.person(id);

ALTER TABLE ONLY public.visit_personal_report
    ADD CONSTRAINT visit_personal_report__reporter_id__to__person__id FOREIGN KEY (reporter_id) REFERENCES public.person(id);

ALTER TABLE ONLY public.visit_personal_report
    ADD CONSTRAINT visit_personal_report__visit_id__to__hospital_visit__id FOREIGN KEY (hospital_visit_id) REFERENCES public.hospital_visit(id);

ALTER TABLE ONLY public.volunteering_time
    ADD CONSTRAINT volunteering_time__event_id__to__event__id FOREIGN KEY (event_id) REFERENCES public.event(id);

ALTER TABLE ONLY public.volunteering_time
    ADD CONSTRAINT volunteering_time__person_id__to__person__id FOREIGN KEY (person_id) REFERENCES public.person(id);

ALTER TABLE ONLY public.volunteering_type
    ADD CONSTRAINT volunteering_type__person_id__to__person__id FOREIGN KEY (person_id) REFERENCES public.person(id);
