import {HospitalVisitEntity} from '@be/hospital-visit/model/hospital-visit.entity';
import {AsyncValidator, User} from '@melluin/common';
import {HospitalVisitActivityEntity} from '@be/hospital-visit-activity/model/hospital-visit-activity.entity';


export interface VisitActivityBasicValidationData {
    visit: HospitalVisitEntity,
    requester: User
}

export interface VisitActivityUpdateValidationData extends VisitActivityBasicValidationData {
    activity: HospitalVisitActivityEntity
}

export type VisitActivityBasicValidator = AsyncValidator<VisitActivityBasicValidationData>;
export type VisitActivityUpdateValidator = AsyncValidator<VisitActivityUpdateValidationData>;
