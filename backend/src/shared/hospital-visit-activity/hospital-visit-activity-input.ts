import {VisitActivityType} from '@shared/hospital-visit-activity/visit-activity-type';


export interface HospitalVisitActivityInput {

    children: Array<string>; // -> id of VisitedChild
    activities: Array<VisitActivityType>;
    comment: string;
    visitId?: string;

}

export interface HospitalVisitActivityEditInput {

    id: string;
    visitId?: string;
    children: Array<string>; // -> id of VisitedChild
    activities: Array<VisitActivityType>;
    comment: string;

}
