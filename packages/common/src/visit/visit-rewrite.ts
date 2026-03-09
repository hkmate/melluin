import {VisitStatus} from './visit-status';
import {Visit} from './visit';
import {UUID} from '../util/type/uuid.type';


export interface VisitRewrite {

    id: UUID;
    dateTimeFrom: string;
    dateTimeTo: string;
    countedMinutes?: number;
    participantIds: Array<UUID>;
    status: VisitStatus;
    departmentId: UUID;
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
