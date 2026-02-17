import {VisitEntity} from '@be/visit/model/visit.entity';
import {AsyncValidator, User} from '@melluin/common';
import {VisitActivityEntity} from '@be/visit-activity/model/visit-activity.entity';


export interface VisitActivityBasicValidationData {
    visit: VisitEntity,
    requester: User
}

export interface VisitActivityUpdateValidationData extends VisitActivityBasicValidationData {
    activity: VisitActivityEntity
}

export type VisitActivityBasicValidator = AsyncValidator<VisitActivityBasicValidationData>;
export type VisitActivityUpdateValidator = AsyncValidator<VisitActivityUpdateValidationData>;
