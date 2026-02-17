import {BadRequestException} from '@nestjs/common';
import {
    VisitConnectionValidationData,
    VisitConnectionValidator
} from '@be/visit-connections/validator/visit-connection-validator';
import {ApiError} from '@melluin/common';


export class VisitsAreNotSameValidator implements VisitConnectionValidator {

    public validate({visit, connectCandidate}: VisitConnectionValidationData): Promise<void> {
        if (visit.id !== connectCandidate.id) {
            return Promise.resolve();
        }
        throw new BadRequestException({
            message: 'Cannot connect visit to itself.',
            code: ApiError.CANNOT_CONNECT_VISITS_TO_ITSELF
        });
    }

}
