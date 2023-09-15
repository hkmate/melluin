import {HospitalVisit} from '@shared/hospital-visit/hospital-visit';
import {HospitalVisitActivity} from '@shared/hospital-visit-activity/hospital-visit-activity';
import {VisitedChild} from '@shared/hospital-visit/visited-child';

export interface WrappedHospitalVisitActivity {

    children: Array<VisitedChild>;
    hospitalVisit: HospitalVisit;
    activities: Array<HospitalVisitActivity>;

}
