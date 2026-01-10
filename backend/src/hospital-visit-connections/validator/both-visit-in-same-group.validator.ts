import {BadRequestException} from '@nestjs/common';
import {
    HospitalVisitConnectionValidationData,
    VisitConnectionValidator
} from '@be/hospital-visit-connections/validator/visit-connection-validator';
import {ApiError} from '@shared/api-util/api-error';


export class BothVisitInSameGroupValidator implements VisitConnectionValidator {

    public validate({visit, connectCandidate}: HospitalVisitConnectionValidationData): Promise<void> {
        if (visit.connectionGroupId === connectCandidate.connectionGroupId) {
            return Promise.resolve();
        }
        throw new BadRequestException({
            message: 'Visits are not in the same connection group.',
            code: ApiError.VISITS_ARE_NOT_IN_SAME_CONNECTION_GROUP
        });
    }

}
