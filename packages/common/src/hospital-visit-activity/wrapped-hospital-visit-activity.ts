import {HospitalVisit} from '../hospital-visit/hospital-visit';
import {HospitalVisitActivity} from './hospital-visit-activity';
import {VisitedChild} from '../hospital-visit/visited-child';
import {HospitalVisitActivityInfo} from './hospital-visit-activity-info';

export interface WrappedHospitalVisitActivity {

    children: Array<VisitedChild>;
    hospitalVisit: HospitalVisit;
    activities: Array<HospitalVisitActivity>;
    info: HospitalVisitActivityInfo;

}
