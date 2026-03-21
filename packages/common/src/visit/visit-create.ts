import {VisitStatus} from './visit-status';
import {UUID} from '../util/type/uuid.type';

export interface VisitCreate {

    dateTimeFrom: string;
    dateTimeTo: string;
    countedMinutes?: number;
    participantIds: Array<UUID>;
    status: VisitStatus;
    departmentId: UUID;
    vicariousMomVisit: boolean;

}
