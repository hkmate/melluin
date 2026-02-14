-- This is needed because we need to support postgres 10.23 and in that version there is no function gen_random_uuid() yet.
-- We may could use an extension like 'uuid-ossp' or 'pgcrypto' but the db provider doesn't allow us add any extension...
-- This solution is from https://stackoverflow.com/a/21327318
CREATE FUNCTION gen_uuid() RETURNS UUID AS $$
    DECLARE
	    uid UUID;
    BEGIN
	    uid := (
            select uuid_in(overlay(overlay(md5(random()::text || ':' || random()::text) placing '4' from 13) placing to_hex(floor(random()*(11-8+1) + 8)::int)::text from 17)::cstring)
        );
        RETURN uid;
    END
$$ LANGUAGE plpgsql;


CREATE TABLE public.children_in_visit (
    id uuid NOT NULL,
    visit_id uuid NOT NULL,
    child_id uuid NOT NULL,
    is_parent_there BOOLEAN
);

CREATE TABLE public.children_in_visit_at_activity (
    visited_child_id uuid NOT NULL,
    activity_id uuid NOT NULL
);

ALTER TABLE ONLY public.children_in_visit
    ADD CONSTRAINT children_in_visit__id__primary_key PRIMARY KEY (id);
ALTER TABLE ONLY public.children_in_visit
    ADD CONSTRAINT children_in_visit__visit_id__to__visit__id FOREIGN KEY (visit_id) REFERENCES public.hospital_visit(id);
ALTER TABLE ONLY public.children_in_visit
    ADD CONSTRAINT children_in_visit__child_id__to__child_patient__id FOREIGN KEY (child_id) REFERENCES public.child_patient(id);

ALTER TABLE ONLY public.children_in_visit_at_activity
    ADD CONSTRAINT children_in_visit_at_activity__primary_key PRIMARY KEY (visited_child_id, activity_id);
ALTER TABLE ONLY public.children_in_visit_at_activity
    ADD CONSTRAINT c_in_v_at_a__to__children_in_visit FOREIGN KEY (visited_child_id) REFERENCES public.children_in_visit(id);
ALTER TABLE ONLY public.children_in_visit_at_activity
    ADD CONSTRAINT c_in_v_at_a__to__hospital_visit_activity FOREIGN KEY (activity_id) REFERENCES public.hospital_visit_activity(id);


CREATE FUNCTION migrate_visited_children() RETURNS void AS $$
    DECLARE
        activity RECORD;
        child_info JSONB;
        new_child_in_visit_id UUID;
        existing_child_in_visit_id UUID;
    BEGIN
        FOR activity IN SELECT * FROM public.hospital_visit_activity LOOP
            FOR child_info IN SELECT jsonb_array_elements(activity.children) LOOP
                existing_child_in_visit_id := (SELECT id
                                            	FROM public.children_in_visit
                                            	WHERE visit_id = activity.hospital_visit_id
                                                	AND child_id = (child_info->>'childId')::uuid);
                IF existing_child_in_visit_id IS NOT NULL
                THEN
                    new_child_in_visit_id := existing_child_in_visit_id;
                ELSE
                    new_child_in_visit_id := (SELECT gen_uuid());
                    INSERT INTO public.children_in_visit(id, visit_id, child_id, is_parent_there)
                    VALUES (new_child_in_visit_id, activity.hospital_visit_id, (child_info->>'childId')::uuid, (child_info->>'isParentThere')::boolean);
                END IF;

                INSERT INTO public.children_in_visit_at_activity(visited_child_id, activity_id)
                VALUES (new_child_in_visit_id, activity.id);

            END LOOP;
        END LOOP;
    END;
$$ LANGUAGE plpgsql;

SELECT migrate_visited_children();

DROP FUNCTION migrate_visited_children;

ALTER TABLE public.hospital_visit_activity DROP COLUMN children;

DROP TABLE public.hospital_visit_tmp;
