import {HospitalVisitStatus} from './hospital-visit-status';
import {EventVisibility} from './event-visibility';

export interface HospitalVisitCreate {

    dateTimeFrom: string;
    dateTimeTo: string;
    countedMinutes?: number;
    visibility: EventVisibility;
    organizerId: string;
    participantIds: Array<string>;
    status: HospitalVisitStatus;
    departmentId: string;
    vicariousMomVisit: boolean;

}
