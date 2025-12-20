import {VisitActivityType} from '@shared/hospital-visit-activity/visit-activity-type';
import {ActivitiesCount} from '@shared/statistics/activities-count';

export interface ActivitiesCountRowItem {
    activity: VisitActivityType;
    count: number;
}

export function mapToActivitiesCount(item: ActivitiesCountRowItem): ActivitiesCount {
    return item;
}
