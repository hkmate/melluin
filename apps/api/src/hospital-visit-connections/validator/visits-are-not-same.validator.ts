import {BadRequestException} from '@nestjs/common';
import {
    HospitalVisitConnectionValidationData,
    VisitConnectionValidator
} from '@be/hospital-visit-connections/validator/visit-connection-validator';
import {ApiError} from '@shared/api-util/api-error';


export class VisitsAreNotSameValidator implements VisitConnectionValidator {

    public validate({visit, connectCandidate}: HospitalVisitConnectionValidationData): Promise<void> {
        if (visit.id !== connectCandidate.id) {
            return Promise.resolve();
        }
        throw new BadRequestException({
            message: 'Cannot connect visit to itself.',
            code: ApiError.CANNOT_CONNECT_VISITS_TO_ITSELF
        });
    }

}
