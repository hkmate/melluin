import {HospitalVisitEntity} from '@be/hospital-visit/model/hospital-visit.entity';
import {AsyncValidator, User} from '@melluin/common';
import {VisitedChildEntity} from '@be/hospital-visit-children/persistence/model/visited-child.entity';


export interface VisitedChildBasicValidationData {
    visit: HospitalVisitEntity,
    requester: User
}

export interface VisitedChildUpdateValidationData extends VisitedChildBasicValidationData {
    visitedChild: VisitedChildEntity
}

export type VisitedChildBasicValidator = AsyncValidator<VisitedChildBasicValidationData>;
export type VisitedChildUpdateValidator = AsyncValidator<VisitedChildUpdateValidationData>;
