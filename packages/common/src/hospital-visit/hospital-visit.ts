import {HospitalVisitStatus} from './hospital-visit-status';
import {Department} from '../department/department';
import {PersonIdentifier} from '../person/person';
import {EventVisibility} from './event-visibility';


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
