import {AsyncValidator} from '@melluin/common';
import {VisitCreateValidationData} from '@be/visit/validator/visit-validator';
import {VisitEntity} from '@be/visit/model/visit.entity';

export interface VisitContinueValidationData extends VisitCreateValidationData {
    originalVisit: VisitEntity
}

export type VisitContinueValidator = AsyncValidator<VisitContinueValidationData>;
