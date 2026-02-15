import {VisitedChildWithChildIdInput} from '@melluin/common';
import {HospitalVisitEntity} from '@be/hospital-visit/model/hospital-visit.entity';


export interface VisitedChildCreation {

    visit: HospitalVisitEntity;

    visitedChildInput: VisitedChildWithChildIdInput;

}
