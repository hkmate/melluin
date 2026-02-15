import {BadRequestException} from '@nestjs/common';
import {ApiError, AsyncValidator, HospitalVisitStatus} from '@melluin/common';
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
