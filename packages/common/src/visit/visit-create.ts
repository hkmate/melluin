import {VisitStatus} from './visit-status';
import {UUID} from '../util/type/uuid.type';

export interface VisitCreate {

    dateTimeFrom: string;
    dateTimeTo: string;
    countedMinutes?: number;
    organizerId: UUID;
    participantIds: Array<UUID>;
    status: VisitStatus;
    departmentId: UUID;
    vicariousMomVisit: boolean;

}
