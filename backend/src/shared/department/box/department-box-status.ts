import {BoxStatusChangeReason} from '@shared/department/box/box-status-change-reason';

export interface DepartmentBoxStatus {

    id: string;
    visitId?: string;
    dateTime: string;
    reason: BoxStatusChangeReason;
    affectedObject?: string;
    comment?: string;

}
