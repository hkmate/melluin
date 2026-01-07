import {HospitalVisitEntity} from '@be/hospital-visit/model/hospital-visit.entity';
import {HospitalVisitRewrite} from '@shared/hospital-visit/hospital-visit-rewrite';
import {User} from '@shared/user/user';
import {AsyncValidator} from '@shared/validator/validator';
import {HospitalVisitCreate} from '@shared/hospital-visit/hospital-visit-create';

export interface HospitalVisitRewriteValidationData {
    entity: HospitalVisitEntity,
    item: HospitalVisitRewrite,
    requester: User,

    sameTimeVisitForced: boolean
}

export interface HospitalVisitCreateValidationData {
    item: HospitalVisitCreate,
    requester: User,

    sameTimeVisitForced: boolean
}

export type VisitValidationData = HospitalVisitRewriteValidationData | HospitalVisitCreateValidationData;

export type VisitRewriteValidator = AsyncValidator<HospitalVisitRewriteValidationData>;
export type VisitCreateValidator = AsyncValidator<HospitalVisitCreateValidationData>;
