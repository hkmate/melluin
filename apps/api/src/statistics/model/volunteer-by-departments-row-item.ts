import {UUID} from '@melluin/common';

export interface VolunteerByDepartmentsRowItem {
    person_id: UUID;
    person_name: string;
    department_id: UUID;
    department_name: string;
    visit_count: number;
    visit_minutes: number;
}
