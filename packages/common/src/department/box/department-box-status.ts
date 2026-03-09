import {BoxStatusChangeReason} from './box-status-change-reason';
import {UUID} from '../../util/type/uuid.type';

export interface DepartmentBoxStatus {

    id: UUID;
    visitId?: UUID;
    dateTime: string;
    reason: BoxStatusChangeReason;
    affectedObject?: string;
    comment?: string;

}

export interface BoxStatusWithDepartmentBrief extends DepartmentBoxStatus {

    departmentId: UUID;
    departmentName: string;

}
