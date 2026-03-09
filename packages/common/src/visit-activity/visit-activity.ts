import {VisitActivityType} from './visit-activity-type';
import {UUID} from '../util/type/uuid.type';


export interface VisitActivity {

    id: UUID;
    children: Array<UUID>; // -> id of VisitedChild
    activities: Array<VisitActivityType>;
    comment: string;

}
