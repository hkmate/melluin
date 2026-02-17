import {Injectable} from '@nestjs/common';
import {
    DateUtil,
    VisitActivity,
    VisitActivityEditInput,
    VisitActivityInput,
    User,
    WrappedVisitActivity
} from '@melluin/common';
import {VisitActivityDao} from '@be/visit-activity/visit-activity.dao';
import {ActivityInputToEntityConverter} from '@be/visit-activity/converter/activity-input-to-entity.converter';
import {ActivityEntityToBasicDtoConverter} from '@be/visit-activity/converter/activity-entity-to-basic-dto.converter';
import {ActivityEntityToWrappedDtoConverter} from '@be/visit-activity/converter/activity-entity-to-wrapped-dto.converter';
import {VisitDao} from '@be/visit/visit.dao';
import {ActivityRewriteApplierFactory} from '@be/visit-activity/applier/activity-rewrite-applier.factory';
import {VisitedChildrenDao} from '@be/visit-children/persistence/visited-children.dao';
import {VisitActivityInfoDao} from '@be/visit-activity-info/visit-activity-info.dao';
import {VisitActivitySaveValidatorFactory} from '@be/visit-activity/validator/visit-activity-save-validator-factory.service';

@Injectable()
export class VisitActivityCrudService {

    constructor(private readonly visitActivityDao: VisitActivityDao,
                private readonly visitDao: VisitDao,
                private readonly visitActivityInfoDao: VisitActivityInfoDao,
                private readonly visitedChildrenDao: VisitedChildrenDao,
                private readonly activityInputToEntityConverter: ActivityInputToEntityConverter,
                private readonly basicDtoConverter: ActivityEntityToBasicDtoConverter,
                private readonly rewriteApplierFactory: ActivityRewriteApplierFactory,
                private readonly validatorFactory: VisitActivitySaveValidatorFactory,
                private readonly wrappedDtoConverter: ActivityEntityToWrappedDtoConverter) {
    }

    public async save(activityInput: VisitActivityInput, requester: User): Promise<VisitActivity> {
        const visit = await this.visitDao.getOne(activityInput.visitId!);

        await this.validatorFactory.getValidatorForCreate()
            .validate({visit, requester});

        const creationEntity = await this.activityInputToEntityConverter.convert(activityInput);
        const entity = await this.visitActivityDao.save(creationEntity);
        return this.basicDtoConverter.convert(entity);
    }

    public async update(activityInput: VisitActivityEditInput, requester: User): Promise<VisitActivity> {
        const visit = await this.visitDao.getOne(activityInput.visitId!);
        const persisted = await this.visitActivityDao.getOne(activityInput.id);

        await this.validatorFactory.getValidatorForUpdate()
            .validate({visit, requester, activity: persisted});

        await this.rewriteApplierFactory.createFor(activityInput)
            .applyOn(persisted);
        const entity = await this.visitActivityDao.save(persisted);
        return this.basicDtoConverter.convert(entity);
    }

    public async delete(visitId: string, activityId: string, requester: User): Promise<void> {
        const visit = await this.visitDao.getOne(visitId);
        const persisted = await this.visitActivityDao.getOne(activityId);

        await this.validatorFactory.getValidatorForDelete()
            .validate({visit, requester, activity: persisted});

        await this.visitActivityDao.delete(persisted);
    }

    public async findByVisitId(visitId: string, requester: User): Promise<WrappedVisitActivity> {
        const visit = await this.visitDao.getOne(visitId);
        const activities = await this.visitActivityDao.findByVisitIds([visitId]);
        const children = await this.visitedChildrenDao.findAllByVisitId(visitId);
        const info = await this.visitActivityInfoDao.getOneByVisitId(visitId);
        return await this.wrappedDtoConverter.convert({visit, activities, children, info});
    }

    public async findByVisitIds(visitIds: Array<string>, requester: User): Promise<Array<WrappedVisitActivity>> {
        const wrappedVisits: Array<WrappedVisitActivity> = await Promise.all(
            visitIds.map(visitId => this.findByVisitId(visitId, requester))
        );
        wrappedVisits.sort(VisitActivityCrudService.compareWrappedByDateDesc);
        return wrappedVisits;
    }

    private static compareWrappedByDateDesc(v1: WrappedVisitActivity, v2: WrappedVisitActivity): number {
        return DateUtil.cmp(v2.visit.dateTimeFrom, v1.visit.dateTimeFrom);
    }

}
