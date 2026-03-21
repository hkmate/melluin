import {Visit} from './visit';
import {UUID} from '../util/type/uuid.type';
import {VisitCreate} from './visit-create';


export type VisitRewrite = VisitCreate & { id: UUID };

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
