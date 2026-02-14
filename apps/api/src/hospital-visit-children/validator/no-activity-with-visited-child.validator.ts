import {BadRequestException, Injectable} from '@nestjs/common';
import {ApiError} from '@shared/api-util/api-error';
import {
    VisitedChildUpdateValidationData,
    VisitedChildUpdateValidator
} from '@be/hospital-visit-children/validator/visited-child-validator';
import {HospitalVisitActivityDao} from '@be/hospital-visit-activity/hospital-visit-activity.dao';
import {HospitalVisitEntity} from '@be/hospital-visit/model/hospital-visit.entity';

@Injectable()
export class NoActivityWithVisitedChildValidator implements VisitedChildUpdateValidator {

    constructor(private readonly hospitalVisitActivityDao: HospitalVisitActivityDao) {
    }

    public async validate({visit, visitedChild}: VisitedChildUpdateValidationData): Promise<void> {
        const childIdsInActivities = await this.getChildrenIdsInVisit(visit)
        const childInActivities = childIdsInActivities.includes(visitedChild.id);
        if (!childInActivities) {
            return;
        }

        throw new BadRequestException({
            message: 'Child cannot be removed from visit because it is in an activity',
            code: ApiError.VISITED_CHILD_REMOVE_DISABLED_CHILD_IS_IN_ACTIVITY
        });
    }

    private async getChildrenIdsInVisit(visit: HospitalVisitEntity): Promise<Array<string>> {
        const activities = await this.hospitalVisitActivityDao.findByVisitId(visit.id);
        return activities
            .map(a => a.children)
            .flat()
            .map(c => c.id);
    }

}
