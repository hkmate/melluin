import {BoxStatusChangeReason} from './box-status-change-reason';
import {UUID} from '../../util/type/uuid.type';

export interface DepartmentBoxStatusReport {

    visitId?: UUID;
    reason: BoxStatusChangeReason;
    affectedObject?: string;
    comment?: string;

}
