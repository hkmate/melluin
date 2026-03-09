import {UUID} from '@melluin/common';

export interface VisitByDepartmentsRowItem {
    department_id: UUID;
    department_name: string;
    visit_count: number;
    visit_minutes: number;
}
