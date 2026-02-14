import {BoxStatusChangeReason} from '@shared/department/box/box-status-change-reason';

export interface DepartmentBoxStatusReport {

    visitId?: string;
    reason: BoxStatusChangeReason;
    affectedObject?: string;
    comment?: string;

}
