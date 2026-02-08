import {HospitalVisitStatus} from '@shared/hospital-visit/hospital-visit-status';
import {HospitalVisit} from '@shared/hospital-visit/hospital-visit';
import {EventVisibility} from '@shared/hospital-visit/event-visibility';


export interface HospitalVisitRewrite {

    id: string;
    dateTimeFrom: string;
    dateTimeTo: string;
    countedMinutes?: number;
    visibility: EventVisibility;
    participantIds: Array<string>;
    status: HospitalVisitStatus;
    departmentId: string;
    vicariousMomVisit: boolean;

}

export function createVisitRewrite(visit: HospitalVisit): HospitalVisitRewrite {
    return {
        id: visit.id,
        departmentId: visit.department.id,
        visibility: visit.visibility,
        dateTimeFrom: visit.dateTimeFrom,
        dateTimeTo: visit.dateTimeTo,
        countedMinutes: visit.countedMinutes,
        participantIds: visit.participants.map(p => p.id),
        status: visit.status,
        vicariousMomVisit: visit.vicariousMomVisit
    };
}
