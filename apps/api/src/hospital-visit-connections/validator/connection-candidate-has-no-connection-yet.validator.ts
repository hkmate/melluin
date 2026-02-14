import {BadRequestException} from '@nestjs/common';
import {
    HospitalVisitConnectionValidationData,
    VisitConnectionValidator
} from '@be/hospital-visit-connections/validator/visit-connection-validator';
import {ApiError} from '@shared/api-util/api-error';
import {HospitalVisitEntity} from '@be/hospital-visit/model/hospital-visit.entity';


export class ConnectionCandidateHasNoConnectionYetValidator implements VisitConnectionValidator {

    public validate({connectCandidate, visit}: HospitalVisitConnectionValidationData): Promise<void> {
        if (this.hasNoConnection(connectCandidate) || this.hasNoConnection(visit)) {
            return Promise.resolve();
        }
        throw new BadRequestException({
            message: 'Both visits you want to connect already in a group',
            code: ApiError.CONNECT_CANDIDATE_ALREADY_IN_GROUP
        });
    }

    private hasNoConnection(visit: HospitalVisitEntity): boolean {
        return visit.id === visit.connectionGroupId;
    }

}
