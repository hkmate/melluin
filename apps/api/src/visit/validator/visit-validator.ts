import {VisitEntity} from '@be/visit/model/visit.entity';
import {AsyncValidator, VisitCreate, VisitRewrite, User} from '@melluin/common';

export interface VisitRewriteValidationData {
    entity: VisitEntity,
    item: VisitRewrite,
    requester: User,

    sameTimeVisitForced: boolean
}

export interface VisitCreateValidationData {
    item: VisitCreate,
    requester: User,

    sameTimeVisitForced: boolean
}

export type VisitValidationData = VisitRewriteValidationData | VisitCreateValidationData;

export type VisitRewriteValidator = AsyncValidator<VisitRewriteValidationData>;
export type VisitCreateValidator = AsyncValidator<VisitCreateValidationData>;
export type VisitSaveValidator = AsyncValidator<VisitValidationData>;
