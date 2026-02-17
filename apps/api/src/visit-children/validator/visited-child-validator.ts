import {VisitEntity} from '@be/visit/model/visit.entity';
import {AsyncValidator, User} from '@melluin/common';
import {VisitedChildEntity} from '@be/visit-children/persistence/model/visited-child.entity';


export interface VisitedChildBasicValidationData {
    visit: VisitEntity,
    requester: User
}

export interface VisitedChildUpdateValidationData extends VisitedChildBasicValidationData {
    visitedChild: VisitedChildEntity
}

export type VisitedChildBasicValidator = AsyncValidator<VisitedChildBasicValidationData>;
export type VisitedChildUpdateValidator = AsyncValidator<VisitedChildUpdateValidationData>;
