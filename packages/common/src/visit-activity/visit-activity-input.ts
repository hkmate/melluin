import {VisitActivityType} from './visit-activity-type';
import {UUID} from '../util/type/uuid.type';


export interface VisitActivityInput {

    visitId?: UUID;
    children: Array<UUID>; // -> id of VisitedChild
    activities: Array<VisitActivityType>;
    comment: string;

}

export interface VisitActivityEditInput {

    id: UUID;
    visitId?: UUID;
    children: Array<UUID>; // -> id of VisitedChild
    activities: Array<VisitActivityType>;
    comment: string;

}
