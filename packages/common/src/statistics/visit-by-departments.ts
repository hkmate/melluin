import {UUID} from '../util/type/uuid.type';

export interface VisitByDepartments {
    departmentId: UUID;
    departmentName: string;
    visitCount: number;
    visitMinutes: number;
}
