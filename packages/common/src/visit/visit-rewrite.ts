import {VisitStatus} from './visit-status';
import {Visit} from './visit';


export interface VisitRewrite {

    id: string;
    dateTimeFrom: string;
    dateTimeTo: string;
    countedMinutes?: number;
    participantIds: Array<string>;
    status: VisitStatus;
    departmentId: string;
    vicariousMomVisit: boolean;

}

export function createVisitRewrite(visit: Visit): VisitRewrite {
    return {
        id: visit.id,
        departmentId: visit.department.id,
        dateTimeFrom: visit.dateTimeFrom,
        dateTimeTo: visit.dateTimeTo,
        countedMinutes: visit.countedMinutes,
        participantIds: visit.participants.map(p => p.id),
        status: visit.status,
        vicariousMomVisit: visit.vicariousMomVisit
    };
}
