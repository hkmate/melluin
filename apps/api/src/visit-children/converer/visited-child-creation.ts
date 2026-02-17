import {VisitedChildWithChildIdInput} from '@melluin/common';
import {VisitEntity} from '@be/visit/model/visit.entity';


export interface VisitedChildCreation {

    visit: VisitEntity;

    visitedChildInput: VisitedChildWithChildIdInput;

}
