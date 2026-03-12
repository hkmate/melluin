import {BadRequestException} from '@nestjs/common';
import {
    VisitConnectionValidationData,
    VisitConnectionValidator
} from '@be/visit-connections/validator/visit-connection-validator';
import {ApiErrors} from '@melluin/common';
import {VisitEntity} from '@be/visit/model/visit.entity';
import * as _ from 'lodash';


export class VisitsHaveCommonParticipantsValidator implements VisitConnectionValidator {

    public validate({visit, connectCandidate}: VisitConnectionValidationData): Promise<void> {
        if (this.hasCommonParticipants(visit, connectCandidate)) {
            return Promise.resolve();
        }
        throw new BadRequestException({
            message: 'Visit you want to connect has too much time difference',
            code: ApiErrors.VISITS_HAS_NO_COMMON_PARTICIPANTS
        });
    }

    private hasCommonParticipants(visit1: VisitEntity, visit2: VisitEntity): boolean {
        const participant1Ids = visit1.participants.map(p => p.id);
        const participant2Ids = visit2.participants.map(p => p.id);

        return _.intersection(participant1Ids, participant2Ids).length > 0
    }

}
