import {HospitalVisitEntity} from '@be/hospital-visit/model/hospital-visit.entity';
import {AsyncValidator, User} from '@melluin/common';

export interface HospitalVisitConnectionValidationData {
    visit: HospitalVisitEntity,
    connectCandidate: HospitalVisitEntity,
    requester: User
}

export type VisitConnectionValidator = AsyncValidator<HospitalVisitConnectionValidationData>;
