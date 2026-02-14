import {VisitedChildWithChildIdInput} from '@shared/hospital-visit/visited-child';
import {HospitalVisitEntity} from '@be/hospital-visit/model/hospital-visit.entity';


export interface VisitedChildCreation {

    visit: HospitalVisitEntity;

    visitedChildInput: VisitedChildWithChildIdInput;

}
