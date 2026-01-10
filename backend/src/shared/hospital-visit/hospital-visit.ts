import {HospitalVisitStatus} from '@shared/hospital-visit/hospital-visit-status';
import {MelluinEvent} from '@shared/event/event';
import {Department} from '@shared/department/department';
import {PersonIdentifier} from '@shared/person/person';


export interface HospitalVisit extends MelluinEvent {

    id: string;
    status: HospitalVisitStatus;
    department: Department;
    connectionGroupId: string;
    participants: Array<PersonIdentifier>;
    vicariousMomVisit: boolean;

}
