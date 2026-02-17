import {Visit} from '../visit/visit';
import {VisitActivity} from './visit-activity';
import {VisitedChild} from '../visit/visited-child';
import {VisitActivityInfo} from './visit-activity-info';

export interface WrappedVisitActivity {

    children: Array<VisitedChild>;
    visit: Visit;
    activities: Array<VisitActivity>;
    info: VisitActivityInfo;

}
