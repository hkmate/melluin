import {HospitalVisitEntity} from '@be/hospital-visit/model/hospital-visit.entity';
import {User} from '@shared/user/user';
import {AsyncValidator} from '@shared/validator/validator';

export interface HospitalVisitConnectionValidationData {
    visit: HospitalVisitEntity,
    connectCandidate: HospitalVisitEntity,
    requester: User
}

export type VisitConnectionValidator = AsyncValidator<HospitalVisitConnectionValidationData>;
