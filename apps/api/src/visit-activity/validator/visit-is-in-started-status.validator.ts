import {BadRequestException} from '@nestjs/common';
import {ApiError, AsyncValidator, VisitStatus} from '@melluin/common';
import {VisitEntity} from '@be/visit/model/visit.entity';

export class VisitIsInStartedStatusValidator implements AsyncValidator<{ visit: VisitEntity }> {

    public validate({visit}: { visit: VisitEntity }): Promise<void> {
        if (visit.status === VisitStatus.STARTED) {
            return Promise.resolve();
        }
        throw new BadRequestException({
            message: 'Cannot change activity to a visit that has other status than STARTED',
            code: ApiError.CANNOT_CHANGE_ACTIVITY_IN_VISIT_NOT_STARTED
        });
    }

}
