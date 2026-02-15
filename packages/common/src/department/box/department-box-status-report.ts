import {BoxStatusChangeReason} from './box-status-change-reason';

export interface DepartmentBoxStatusReport {

    visitId?: string;
    reason: BoxStatusChangeReason;
    affectedObject?: string;
    comment?: string;

}
