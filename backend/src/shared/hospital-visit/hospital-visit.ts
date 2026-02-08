import {HospitalVisitStatus} from '@shared/hospital-visit/hospital-visit-status';
import {Department} from '@shared/department/department';
import {PersonIdentifier} from '@shared/person/person';
import {EventVisibility} from '@shared/hospital-visit/event-visibility';


export interface HospitalVisit {

    id: string;
    dateTimeFrom: string;
    dateTimeTo: string;
    countedMinutes?: number;
    visibility: EventVisibility;
    organizer: PersonIdentifier;
    status: HospitalVisitStatus;
    department: Department;
    connectionGroupId: string;
    participants: Array<PersonIdentifier>;
    vicariousMomVisit: boolean;

}
