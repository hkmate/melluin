DROP TABLE IF EXISTS certificate;
DROP TABLE IF EXISTS hospital_visit_action;
DROP TABLE IF EXISTS notification;
DROP TABLE IF EXISTS visit_personal_report_answer;
DROP TABLE IF EXISTS visit_personal_report;
DROP TABLE IF EXISTS volunteering_time;
DROP TABLE IF EXISTS volunteering_type;
DROP TABLE IF EXISTS event_participant;
DROP TABLE IF EXISTS general_event;

ALTER TABLE hospital_visit DROP COLUMN visibility;
