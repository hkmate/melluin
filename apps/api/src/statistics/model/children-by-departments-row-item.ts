import {UUID} from '@melluin/common';

export interface ChildrenByDepartmentsRowItem {
    department_id: UUID;
    department_name: string;
    child_contact: number;
    child: number;
    child_with_relative_present: number;
}
