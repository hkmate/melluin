import * as _ from 'lodash';
import {cast} from '@shared/util/test-util';
import {VolunteerByDepartments} from '@shared/statistics/volunteer-by-departments';

export interface VolunteerByDepartmentsRowItem {
    person_id: string;
    person_name: string;
    department_id: string;
    department_name: string;
    visit_count: number;
    visit_minutes: number;
}

export function mapToVolunteerByDepartments(item: VolunteerByDepartmentsRowItem): VolunteerByDepartments {
    const mapped =_.mapKeys(item, (value, key) => _.camelCase(key));
    return cast<VolunteerByDepartments>(mapped);
}
