import {BoxStatusChangeReason} from './box-status-change-reason';

export interface DepartmentBoxStatus {

    id: string;
    visitId?: string;
    dateTime: string;
    reason: BoxStatusChangeReason;
    affectedObject?: string;
    comment?: string;

}

export interface BoxStatusWithDepartmentBrief extends DepartmentBoxStatus {

    departmentId: string;
    departmentName: string;

}
