UPDATE public.hospital_visit SET status = 'ACTIVITIES_FILLED_OUT' WHERE status = 'JUST_REQUIRED_FIELDS_FILLED';
UPDATE public.hospital_visit SET status = 'ALL_FILLED_OUT' WHERE status = 'ALL_FIELDS_FILLED';
UPDATE public.hospital_visit SET status = 'SUCCESSFUL' WHERE status = 'ENDED_SUCCESSFULLY';
