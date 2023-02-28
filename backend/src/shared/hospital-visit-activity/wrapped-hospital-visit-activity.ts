import {Child} from '@shared/child/child';
import {HospitalVisit} from '@shared/hospital-visit/hospital-visit';
import {HospitalVisitActivity} from '@shared/hospital-visit-activity/hospital-visit-activity';

export interface WrappedHospitalVisitActivity {

    children: Array<Child>;
    hospitalVisit: HospitalVisit;
    activities: Array<HospitalVisitActivity>;

}
