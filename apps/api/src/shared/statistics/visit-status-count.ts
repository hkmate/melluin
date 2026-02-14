import {HospitalVisitStatus} from '@shared/hospital-visit/hospital-visit-status';

export interface VisitStatusCount {
    status: HospitalVisitStatus;
    count: number;
}
