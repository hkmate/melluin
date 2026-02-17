import {VisitActivityType} from './visit-activity-type';


export interface VisitActivityInput {

    children: Array<string>; // -> id of VisitedChild
    activities: Array<VisitActivityType>;
    comment: string;
    visitId?: string;

}

export interface VisitActivityEditInput {

    id: string;
    visitId?: string;
    children: Array<string>; // -> id of VisitedChild
    activities: Array<VisitActivityType>;
    comment: string;

}
