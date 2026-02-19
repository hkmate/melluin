import {VisitStatus} from './visit-status';
import {Department} from '../department/department';
import {PersonIdentifier} from '../person/person';


export interface Visit {

    id: string;
    dateTimeFrom: string;
    dateTimeTo: string;
    countedMinutes?: number;
    organizer: PersonIdentifier;
    status: VisitStatus;
    department: Department;
    connectionGroupId: string;
    participants: Array<PersonIdentifier>;
    vicariousMomVisit: boolean;

}
