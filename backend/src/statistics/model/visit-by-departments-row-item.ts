import * as _ from 'lodash';
import {cast} from '@shared/util/test-util';
import {VisitByDepartments} from '@shared/statistics/visit-by-departments';

export interface VisitByDepartmentsRowItem {
    department_id: string;
    department_name: string;
    visit_count: number;
    visit_minutes: number;
}

export function mapToVisitByDepartments(item: VisitByDepartmentsRowItem): VisitByDepartments {
    const mapped =_.mapKeys(item, (value, key) => _.camelCase(key));
    return cast<VisitByDepartments>(mapped);
}
