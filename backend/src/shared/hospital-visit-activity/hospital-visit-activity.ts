import {VisitActivityType} from '@shared/hospital-visit-activity/visit-activity-type';
import {ActivityChildInfo} from '@shared/hospital-visit-activity/hospital-visit-activity-input';


export interface HospitalVisitActivity {

    id: string;
    children: Array<ActivityChildInfo>;
    activities: Array<VisitActivityType>;
    comment: string;

}
