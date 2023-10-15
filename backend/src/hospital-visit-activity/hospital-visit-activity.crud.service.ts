import {BadRequestException, Injectable} from '@nestjs/common';
import {User} from '@shared/user/user';
import {HospitalVisitActivityDao} from '@be/hospital-visit-activity/hospital-visit-activity.dao';
import {
    HospitalVisitActivityEditInput,
    HospitalVisitActivityInput
} from '@shared/hospital-visit-activity/hospital-visit-activity-input';
import {HospitalVisitActivity} from '@shared/hospital-visit-activity/hospital-visit-activity';
import {ActivityInputToEntityConverter} from '@be/hospital-visit-activity/converter/activity-input-to-entity.converter';
import {ActivityEntityToBasicDtoConverter} from '@be/hospital-visit-activity/converter/activity-entity-to-basic-dto.converter';
import {WrappedHospitalVisitActivity} from '@shared/hospital-visit-activity/wrapped-hospital-visit-activity';
import {ActivityEntityToWrappedDtoConverter} from '@be/hospital-visit-activity/converter/activity-entity-to-wrapped-dto.converter';
import {HospitalVisitDao} from '@be/hospital-visit/hospital-visit.dao';
import {HospitalVisitStatus} from '@shared/hospital-visit/hospital-visit-status';
import {HospitalVisitEntity} from '@be/hospital-visit/model/hospital-visit.entity';
import {ActivityRewriteApplierFactory} from '@be/hospital-visit-activity/applier/activity-rewrite-applier.factory';
import {DateUtil} from '@shared/util/date-util';
import {VisitedChildrenDao} from '@be/hospital-visit-children/persistence/visited-children.dao';
import {HospitalVisitActivityEntity} from '@be/hospital-visit-activity/model/hospital-visit-activity.entity';

@Injectable()
export class HospitalVisitActivityCrudService {

    constructor(private readonly hospitalVisitActivityDao: HospitalVisitActivityDao,
                private readonly hospitalVisitDao: HospitalVisitDao,
                private readonly visitedChildrenDao: VisitedChildrenDao,
                private readonly activityInputToEntityConverter: ActivityInputToEntityConverter,
                private readonly basicDtoConverter: ActivityEntityToBasicDtoConverter,
                private readonly rewriteApplierFactory: ActivityRewriteApplierFactory,
                private readonly wrappedDtoConverter: ActivityEntityToWrappedDtoConverter) {
    }

    public async save(activityInput: HospitalVisitActivityInput, requester: User): Promise<HospitalVisitActivity> {
        const visit = await this.hospitalVisitDao.getOne(activityInput.visitId!);
        this.verifyVisitIsStarted(visit);
        const creationEntity = await this.activityInputToEntityConverter.convert(activityInput);
        const entity = await this.hospitalVisitActivityDao.save(creationEntity);
        return this.basicDtoConverter.convert(entity);
    }

    public async update(activityInput: HospitalVisitActivityEditInput, requester: User): Promise<HospitalVisitActivity> {
        const visit = await this.hospitalVisitDao.getOne(activityInput.visitId!);
        const persisted = await this.hospitalVisitActivityDao.getOne(activityInput.id);
        this.verifyVisitIsStarted(visit);
        this.verifyActivityIsInVisit(persisted, visit);

        await this.rewriteApplierFactory.createFor(activityInput)
            .applyOn(persisted);
        const entity = await this.hospitalVisitActivityDao.save(persisted);
        return this.basicDtoConverter.convert(entity);
    }

    public async delete(visitId: string, activityId: string, requester: User): Promise<void> {
        const visit = await this.hospitalVisitDao.getOne(visitId);
        const persisted = await this.hospitalVisitActivityDao.getOne(activityId);

        this.verifyVisitIsStarted(visit);
        this.verifyActivityIsInVisit(persisted, visit);

        await this.hospitalVisitActivityDao.delete(persisted);
    }

    public async findByVisitId(visitId: string, requester: User): Promise<WrappedHospitalVisitActivity> {
        const visit = await this.hospitalVisitDao.getOne(visitId);
        const activities = await this.hospitalVisitActivityDao.findByVisitIds([visitId]);
        const children = await this.visitedChildrenDao.findAllByVisitId(visitId);
        return await this.wrappedDtoConverter.convert({visit, activities, children});
    }

    public async findByVisitIds(visitIds: Array<string>, requester: User): Promise<Array<WrappedHospitalVisitActivity>> {
        const wrappedVisits: Array<WrappedHospitalVisitActivity> = await Promise.all(
            visitIds.map(visitId => this.findByVisitId(visitId, requester))
        );
        wrappedVisits.sort(HospitalVisitActivityCrudService.compareWrappedByDateDesc);
        return wrappedVisits;
    }

    private verifyVisitIsStarted(visit: HospitalVisitEntity): void {
        if (visit.status !== HospitalVisitStatus.STARTED) {
            throw new BadRequestException('Manage activity is only acceptable when the visit is in status: STARTED');
        }
    }

    private verifyActivityIsInVisit(activity: HospitalVisitActivityEntity, visit: HospitalVisitEntity): void {
        if (activity.hospitalVisit.id !== visit.id) {
            throw new BadRequestException(`Activity is not in visit with id: ${visit.id}`);
        }
    }

    private static compareWrappedByDateDesc(v1: WrappedHospitalVisitActivity, v2: WrappedHospitalVisitActivity): number {
        return DateUtil.cmp(v2.hospitalVisit.dateTimeFrom, v1.hospitalVisit.dateTimeFrom);
    }

}
