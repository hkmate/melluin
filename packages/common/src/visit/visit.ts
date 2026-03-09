import {VisitStatus} from './visit-status';
import {Department} from '../department/department';
import {PersonIdentifier} from '../person/person';
import {UUID} from '../util/type/uuid.type';


export interface Visit {

    id: UUID;
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
