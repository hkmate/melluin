import {BadRequestException} from '@nestjs/common';
import {
    HospitalVisitConnectionValidationData,
    VisitConnectionValidator
} from '@be/hospital-visit-connections/validator/visit-connection-validator';
import {ApiError} from '@shared/api-util/api-error';


export class VisitHaveSameDateValidator implements VisitConnectionValidator {

    // 30 minutes different is allowed between visits.
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    private static readonly ALLOWED_DIFFERENCE = 30 * 60 * 1000;

    public validate({visit, connectCandidate}: HospitalVisitConnectionValidationData): Promise<void> {
        if (this.areDateDifferenceAllowed(connectCandidate.dateTimeTo, visit.dateTimeFrom)
            || this.areDateDifferenceAllowed(visit.dateTimeTo, connectCandidate.dateTimeFrom)) {
            return Promise.resolve();
        }
        throw new BadRequestException({
            message: 'Visit you want to connect has too much time difference',
            code: ApiError.CONNECT_CANDIDATE_IS_MUCH_EARLIER_OR_LATER
        });
    }

    private areDateDifferenceAllowed(date1: Date, date2: Date): boolean {
        return Math.abs(date1.getTime() - date2.getTime()) < VisitHaveSameDateValidator.ALLOWED_DIFFERENCE;
    }

}
