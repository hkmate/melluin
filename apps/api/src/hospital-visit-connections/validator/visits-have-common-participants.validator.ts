import {BadRequestException} from '@nestjs/common';
import {
    HospitalVisitConnectionValidationData,
    VisitConnectionValidator
} from '@be/hospital-visit-connections/validator/visit-connection-validator';
import {ApiError} from '@shared/api-util/api-error';
import {HospitalVisitEntity} from '@be/hospital-visit/model/hospital-visit.entity';
import * as _ from 'lodash';


export class VisitsHaveCommonParticipantsValidator implements VisitConnectionValidator {

    public validate({visit, connectCandidate}: HospitalVisitConnectionValidationData): Promise<void> {
        if (this.hasCommonParticipants(visit, connectCandidate)) {
            return Promise.resolve();
        }
        throw new BadRequestException({
            message: 'Visit you want to connect has too much time difference',
            code: ApiError.VISITS_HAS_NO_COMMON_PARTICIPANTS
        });
    }

    private hasCommonParticipants(visit1: HospitalVisitEntity, visit2: HospitalVisitEntity): boolean {
        const participant1Ids = visit1.participants.map(p => p.id);
        const participant2Ids = visit2.participants.map(p => p.id);

        return _.intersection(participant1Ids, participant2Ids).length > 0
    }

}
