import {HospitalVisitEntity} from '@be/hospital-visit/model/hospital-visit.entity';
import {AsyncValidator} from '@shared/validator/validator';
import {VisitedChildEntity} from '@be/hospital-visit-children/persistence/model/visited-child.entity';
import {User} from '@shared/user/user';


export interface VisitedChildBasicValidationData {
    visit: HospitalVisitEntity,
    requester: User
}

export interface VisitedChildUpdateValidationData extends VisitedChildBasicValidationData {
    visitedChild: VisitedChildEntity
}

export type VisitedChildBasicValidator = AsyncValidator<VisitedChildBasicValidationData>;
export type VisitedChildUpdateValidator = AsyncValidator<VisitedChildUpdateValidationData>;
