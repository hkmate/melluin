import {BadRequestException} from '@nestjs/common';
import {ApiError} from '@shared/api-util/api-error';
import {HospitalVisitStatus} from '@shared/hospital-visit/hospital-visit-status';
import {AsyncValidator} from '@shared/validator/validator';
import {HospitalVisitEntity} from '@be/hospital-visit/model/hospital-visit.entity';

export class VisitIsInStartedStatusValidator implements AsyncValidator<{ visit: HospitalVisitEntity }> {

    public validate({visit}: { visit: HospitalVisitEntity }): Promise<void> {
        if (visit.status === HospitalVisitStatus.STARTED) {
            return Promise.resolve();
        }
        throw new BadRequestException({
            message: 'Cannot change activity to a visit that has other status than STARTED',
            code: ApiError.CANNOT_CHANGE_ACTIVITY_IN_VISIT_NOT_STARTED
        });
    }

}
