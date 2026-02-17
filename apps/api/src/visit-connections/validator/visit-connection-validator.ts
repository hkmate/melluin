import {VisitEntity} from '@be/visit/model/visit.entity';
import {AsyncValidator, User} from '@melluin/common';

export interface VisitConnectionValidationData {
    visit: VisitEntity,
    connectCandidate: VisitEntity,
    requester: User
}

export type VisitConnectionValidator = AsyncValidator<VisitConnectionValidationData>;
