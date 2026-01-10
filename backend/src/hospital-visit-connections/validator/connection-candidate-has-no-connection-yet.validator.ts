import {BadRequestException} from '@nestjs/common';
import {
    HospitalVisitConnectionValidationData,
    VisitConnectionValidator
} from '@be/hospital-visit-connections/validator/visit-connection-validator';
import {ApiError} from '@shared/api-util/api-error';


export class ConnectionCandidateHasNoConnectionYetValidator implements VisitConnectionValidator {

    public validate({connectCandidate}: HospitalVisitConnectionValidationData): Promise<void> {
        if (connectCandidate.id === connectCandidate.connectionGroupId) {
            return Promise.resolve();
        }
        throw new BadRequestException({
            message: 'Visit you want to connect already in a group',
            code: ApiError.CONNECT_CANDIDATE_ALREADY_IN_GROUP
        });
    }

}
