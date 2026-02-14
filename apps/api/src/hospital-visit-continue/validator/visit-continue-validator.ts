import {AsyncValidator} from '@shared/validator/validator';
import {HospitalVisitCreateValidationData} from '@be/hospital-visit/validator/visit-validator';
import {HospitalVisitEntity} from '@be/hospital-visit/model/hospital-visit.entity';

export interface VisitContinueValidationData extends HospitalVisitCreateValidationData {
    originalVisit: HospitalVisitEntity
}

export type VisitContinueValidator = AsyncValidator<VisitContinueValidationData>;
