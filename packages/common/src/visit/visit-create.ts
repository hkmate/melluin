import {VisitStatus} from './visit-status';
import {EventVisibility} from './event-visibility';

export interface VisitCreate {

    dateTimeFrom: string;
    dateTimeTo: string;
    countedMinutes?: number;
    visibility: EventVisibility;
    organizerId: string;
    participantIds: Array<string>;
    status: VisitStatus;
    departmentId: string;
    vicariousMomVisit: boolean;

}
