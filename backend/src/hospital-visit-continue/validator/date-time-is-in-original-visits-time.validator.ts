import {BadRequestException} from '@nestjs/common';
import {ApiError} from '@shared/api-util/api-error';
import {
    VisitContinueValidationData,
    VisitContinueValidator
} from '@be/hospital-visit-continue/validator/visit-continue-validator';
import {HospitalVisitEntity} from '@be/hospital-visit/model/hospital-visit.entity';
import dayjs from 'dayjs';

export class DateTimeIsInOriginalVisitsTimeValidator implements VisitContinueValidator {

    private readonly MIN_DIFFERENCE_MINUTES = 5;

    public validate({originalVisit, item}: VisitContinueValidationData): Promise<void> {
        this.verifyDateTimeForOriginalVisit(originalVisit, item.dateTimeFrom);
        return Promise.resolve();
    }

    private verifyDateTimeForOriginalVisit(visit: HospitalVisitEntity, dateTime: string): void | never {
        const beforeOriginalToDate = this.isDateTimeBeforeAtLeastMinimum(dateTime, visit.dateTimeTo);
        const afterOriginalFromDate = this.isDateTimeBeforeAtLeastMinimum(visit.dateTimeFrom, dateTime);

        if (beforeOriginalToDate && afterOriginalFromDate) {
            return;
        }
        throw new BadRequestException({
            message: 'Date time is not valid for the original visit\'s from-to date times.',
            code: ApiError.DATE_TIME_NOT_FITS_FOR_ORIGINAL_VISIT
        });
    }

    private isDateTimeBeforeAtLeastMinimum(dateTime1: Date | string, dateTime2: Date | string): boolean {
        return dayjs(dateTime1)
            .add(this.MIN_DIFFERENCE_MINUTES, 'minutes')
            .isBefore(dayjs(dateTime2));
    }

}
