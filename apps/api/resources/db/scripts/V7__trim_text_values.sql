
UPDATE hospital_box_status_report SET comment = TRIM(comment);

UPDATE hospital_department SET "name" = TRIM("name");
UPDATE hospital_department SET "address" = TRIM("address");

UPDATE child_patient SET "name" = TRIM("name");

UPDATE person SET first_name = TRIM(first_name);
UPDATE person SET last_name = TRIM(last_name);
UPDATE person SET phone = TRIM(phone);
UPDATE person SET email = TRIM(email);
