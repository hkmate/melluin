import {BadRequestException, Injectable} from '@nestjs/common';
import {User} from '@shared/user/user';
import {HospitalVisitActivityDao} from '@be/hospital-visit-activity/hospital-visit-activity.dao';
import {HospitalVisitActivityInput} from '@shared/hospital-visit-activity/hospital-visit-activity-input';
import {HospitalVisitActivity} from '@shared/hospital-visit-activity/hospital-visit-activity';
import {ActivityInputToEntityConverter} from '@be/hospital-visit-activity/converter/activity-input-to-entity.converter';
import {ActivityEntityToBasicDtoConverter} from '@be/hospital-visit-activity/converter/activity-entity-to-basic-dto.converter';
import {WrappedHospitalVisitActivity} from '@shared/hospital-visit-activity/wrapped-hospital-visit-activity';
import {ActivityEntityToWrappedDtoConverter} from '@be/hospital-visit-activity/converter/activity-entity-to-wrapped-dto.converter';
import {HospitalVisitActivityEntity} from '@be/hospital-visit-activity/model/hospital-visit-activity.entity';
import * as _ from 'lodash';
import {HospitalVisitDao} from '@be/hospital-visit/hospital-visit.dao';
import {HospitalVisitStatus} from '@shared/hospital-visit/hospital-visit-status';
import {HospitalVisitEntity} from '@be/hospital-visit/model/hospital-visit.entity';
import {ActivityRewriteApplierFactory} from '@be/hospital-visit-activity/applier/activity-rewrite-applier.factory';
import {DateUtil} from '@shared/util/date-util';

@Injectable()
export class HospitalVisitActivityCrudService {

    constructor(private readonly hospitalVisitActivityDao: HospitalVisitActivityDao,
                private readonly hospitalVisitDao: HospitalVisitDao,
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

    public async update(id: string, activityInput: HospitalVisitActivityInput, requester: User): Promise<HospitalVisitActivity> {
        const persisted = await this.hospitalVisitActivityDao.getOne(id);
        await this.rewriteApplierFactory.createFor(activityInput)
            .applyOn(persisted);
        const entity = await this.hospitalVisitActivityDao.save(persisted);
        return this.basicDtoConverter.convert(entity);
    }

    public async findByVisitId(visitId: string, requester: User): Promise<WrappedHospitalVisitActivity> {
        const rawEntities = await this.hospitalVisitActivityDao.findByVisitIds([visitId]);
        return await this.wrappedDtoConverter.convert(rawEntities);
    }

    public async findByVisitIds(visitIds: Array<string>, requester: User): Promise<Array<WrappedHospitalVisitActivity>> {
        const rawEntities = await this.hospitalVisitActivityDao.findByVisitIds(visitIds);
        const rawEntitiesGroupedByVisit = this.separateByVisits(rawEntities);
        const wrappedVisits = await this.convertToWrappedDto(rawEntitiesGroupedByVisit);
        wrappedVisits.sort(HospitalVisitActivityCrudService.compareWrappedByDateDesc);
        return wrappedVisits;
    }

    private separateByVisits(entities: Array<HospitalVisitActivityEntity>): Array<Array<HospitalVisitActivityEntity>> {
        return Object.values(_.groupBy(entities, entity => entity.hospitalVisit.id));
    }

    private verifyVisitIsStarted(visit: HospitalVisitEntity): void {
        if (visit.status !== HospitalVisitStatus.STARTED) {
            throw new BadRequestException('Save activity is only acceptable when the visit is in status: STARTED');
        }
    }

    private convertToWrappedDto(groupedByVisit: Array<Array<HospitalVisitActivityEntity>>): Promise<Array<WrappedHospitalVisitActivity>> {
        return Promise.all(
            groupedByVisit.map(activities =>
                this.wrappedDtoConverter.convert(activities))
        );
    }

    private static compareWrappedByDateDesc(v1: WrappedHospitalVisitActivity, v2: WrappedHospitalVisitActivity): number {
        return DateUtil.cmp(v2.hospitalVisit.dateTimeFrom, v1.hospitalVisit.dateTimeFrom);
    }

}
