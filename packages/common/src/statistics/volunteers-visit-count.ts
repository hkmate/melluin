import {UUID} from '../util/type/uuid.type';

export interface VolunteersVisitCount {
    personId: UUID;
    personName: string;
    visitCount: number;
    visitMinutes: number;
}
