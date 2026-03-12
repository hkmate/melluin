import {BadRequestException} from '@nestjs/common';
import {ApiErrors, AsyncValidator, VisitStatuses} from '@melluin/common';
import {VisitEntity} from '@be/visit/model/visit.entity';

export class VisitIsInStartedStatusValidator implements AsyncValidator<{ visit: VisitEntity }> {

    public validate({visit}: { visit: VisitEntity }): Promise<void> {
        if (visit.status === VisitStatuses.STARTED) {
            return Promise.resolve();
        }
        throw new BadRequestException({
            message: 'Cannot change activity to a visit that has other status than STARTED',
            code: ApiErrors.CANNOT_CHANGE_ACTIVITY_IN_VISIT_NOT_STARTED
        });
    }

}
