import {VisitActivityType} from '@shared/hospital-visit-activity/visit-activity-type';


export interface HospitalVisitActivity {

    id: string;
    children: Array<string>; // -> id of VisitedChild
    activities: Array<VisitActivityType>;
    comment: string;

}
