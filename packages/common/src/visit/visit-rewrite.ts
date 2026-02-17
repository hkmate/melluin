import {VisitStatus} from './visit-status';
import {Visit} from './visit';
import {EventVisibility} from './event-visibility';


export interface VisitRewrite {

    id: string;
    dateTimeFrom: string;
    dateTimeTo: string;
    countedMinutes?: number;
    visibility: EventVisibility;
    participantIds: Array<string>;
    status: VisitStatus;
    departmentId: string;
    vicariousMomVisit: boolean;

}

export function createVisitRewrite(visit: Visit): VisitRewrite {
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
