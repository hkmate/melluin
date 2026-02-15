import {HospitalVisitEntity} from '@be/hospital-visit/model/hospital-visit.entity';
import {AsyncValidator, HospitalVisitCreate, HospitalVisitRewrite, User} from '@melluin/common';

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
export type VisitSaveValidator = AsyncValidator<VisitValidationData>;
