import {VisitStatus} from './visit-status';

export interface VisitCreate {

    dateTimeFrom: string;
    dateTimeTo: string;
    countedMinutes?: number;
    organizerId: string;
    participantIds: Array<string>;
    status: VisitStatus;
    departmentId: string;
    vicariousMomVisit: boolean;

}
