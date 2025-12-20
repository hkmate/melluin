import {HospitalVisitStatus} from '@shared/hospital-visit/hospital-visit-status';
import {VisitStatusCount} from '@shared/statistics/visit-status-count';

export interface VisitStatusCountRowItem {
    status: HospitalVisitStatus;
    count: number;
}

export function mapToVisitStatusCount(item: VisitStatusCountRowItem): VisitStatusCount {
    return item;
}
