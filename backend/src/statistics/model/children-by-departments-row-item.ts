import {cast} from '@shared/util/test-util';
import {ChildrenByDepartments} from '@shared/statistics/children-by-departments';
import * as _ from 'lodash';

export interface ChildrenByDepartmentsRowItem {
    department_id: string;
    department_name: string;
    child_contact: number;
    child: number;
    child_with_relative_present: number;
}

export function mapToChildrenByDepartments(item: ChildrenByDepartmentsRowItem): ChildrenByDepartments {
    const mapped =_.mapKeys(item, (value, key) => _.camelCase(key));
    return cast<ChildrenByDepartments>(mapped);
}
