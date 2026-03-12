import {BadRequestException} from '@nestjs/common';
import {
    VisitConnectionValidationData,
    VisitConnectionValidator
} from '@be/visit-connections/validator/visit-connection-validator';
import {ApiErrors} from '@melluin/common';
import {VisitEntity} from '@be/visit/model/visit.entity';


export class ConnectionCandidateHasNoConnectionYetValidator implements VisitConnectionValidator {

    public validate({connectCandidate, visit}: VisitConnectionValidationData): Promise<void> {
        if (this.hasNoConnection(connectCandidate) || this.hasNoConnection(visit)) {
            return Promise.resolve();
        }
        throw new BadRequestException({
            message: 'Both visits you want to connect already in a group',
            code: ApiErrors.CONNECT_CANDIDATE_ALREADY_IN_GROUP
        });
    }

    private hasNoConnection(visit: VisitEntity): boolean {
        return visit.id === visit.connectionGroupId;
    }

}
