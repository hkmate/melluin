import {VisitActivityType} from './visit-activity-type';
import {UUID} from '../util/type/uuid.type';


export interface VisitActivityInput {

    children: Array<UUID>; // -> id of VisitedChild
    activities: Array<VisitActivityType>;
    comment: string;
    visitId?: UUID;

}

export interface VisitActivityEditInput {

    id: UUID;
    visitId?: UUID;
    children: Array<UUID>; // -> id of VisitedChild
    activities: Array<VisitActivityType>;
    comment: string;

}
