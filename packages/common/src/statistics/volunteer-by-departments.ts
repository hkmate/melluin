import {UUID} from '../util/type/uuid.type';

export interface VolunteerByDepartments {
    personId: UUID;
    personName: string;
    departmentId: UUID;
    departmentName: string;
    visitCount: number;
    visitMinutes: number;
}
