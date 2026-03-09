import {UUID} from '../util/type/uuid.type';

export interface ChildrenByDepartments {
    departmentId: UUID;
    departmentName: string;
    childContact: number;
    child: number;
    childWithRelativePresent: number;
}
