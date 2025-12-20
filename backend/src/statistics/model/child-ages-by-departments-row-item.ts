import * as _ from 'lodash';
import {cast} from '@shared/util/test-util';
import {ChildAgesByDepartments} from '@shared/statistics/child-ages-by-departments';

export interface ChildAgesByDepartmentsRowItem {
    department_id: string;
    department_name: string;
    sum: number;
    zero_to_half: number;
    half_to_one: number;
    one_to_three: number;
    three_to_five: number;
    five_to_seven: number;
    seven_to_nine: number;
    nine_to_eleven: number;
    eleven_to_thirteen: number;
    thirteen_to_fifteen: number;
    fifteen_to_seventeen: number;
    seventeen_to_up: number;
}

export function mapToChildAgesByDepartments(item: ChildAgesByDepartmentsRowItem): ChildAgesByDepartments {
    const mapped =_.mapKeys(item, (value, key) => _.camelCase(key));
    return cast<ChildAgesByDepartments>(mapped);
}
