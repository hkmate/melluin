import {BadRequestException, Injectable} from '@nestjs/common';
import {ApiError} from '@melluin/common';
import {
    VisitedChildUpdateValidationData,
    VisitedChildUpdateValidator
} from '@be/visit-children/validator/visited-child-validator';
import {VisitActivityDao} from '@be/visit-activity/visit-activity.dao';
import {VisitEntity} from '@be/visit/model/visit.entity';

@Injectable()
export class NoActivityWithVisitedChildValidator implements VisitedChildUpdateValidator {

    constructor(private readonly visitActivityDao: VisitActivityDao) {
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

    private async getChildrenIdsInVisit(visit: VisitEntity): Promise<Array<string>> {
        const activities = await this.visitActivityDao.findByVisitId(visit.id);
        return activities
            .map(a => a.children)
            .flat()
            .map(c => c.id);
    }

}
