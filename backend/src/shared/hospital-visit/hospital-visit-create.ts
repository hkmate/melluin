import {HospitalVisitStatus} from '@shared/hospital-visit/hospital-visit-status';
import {EventVisibility} from '@shared/hospital-visit/event-visibility';

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
