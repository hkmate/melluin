import {BadRequestException, Injectable} from '@nestjs/common';
import {flatten, isNil, isNotEmpty} from '@shared/util/util';
import {Converter} from '@shared/converter';
import {
    ActivityChildInfo,
    HospitalVisitActivityInput
} from '@shared/hospital-visit-activity/hospital-visit-activity-input';
import {HospitalVisitActivityEntity} from '@be/hospital-visit-activity/model/hospital-visit-activity.entity';
import {HospitalVisitDao} from '@be/hospital-visit/hospital-visit.dao';
import {ChildDao} from '@be/child/child.dao';
import {ChildEntity} from '@be/child/model/child.entity';
import * as _ from 'lodash';
import {randomUUID} from 'crypto';

@Injectable()
export class ActivityInputToEntityConverter
    implements Converter<HospitalVisitActivityInput, Promise<Array<HospitalVisitActivityEntity>>> {

    constructor(private readonly visitDao: HospitalVisitDao,
                private readonly childDao: ChildDao) {
    }

    public convert(value: HospitalVisitActivityInput): Promise<Array<HospitalVisitActivityEntity>>;
    public convert(value: undefined): undefined;
    public convert(value?: HospitalVisitActivityInput): Promise<Array<HospitalVisitActivityEntity>> | undefined;
    public convert(value?: HospitalVisitActivityInput): Promise<Array<HospitalVisitActivityEntity>> | undefined {
        if (isNil(value)) {
            return undefined;
        }
        return this.convertNotNil(value);
    }

    private async convertNotNil(dto: HospitalVisitActivityInput): Promise<Array<HospitalVisitActivityEntity>> {
        const activitiesFromType = this.prepareActivitiesByType(dto);
        const activitiesWithChildren = await this.prepareActivitiesWithChildren(activitiesFromType, dto.children);
        await this.fillActivitiesWithVisit(activitiesWithChildren, dto.visitId!);
        return activitiesWithChildren as Array<HospitalVisitActivityEntity>;
    }

    private prepareActivitiesByType(dto: HospitalVisitActivityInput): Array<Partial<HospitalVisitActivityEntity>> {
        return dto.activities.map(type => ({
            type,
            comment: dto.comment
        }));
    }

    private async prepareActivitiesWithChildren(activitiesFromType: Array<Partial<HospitalVisitActivityEntity>>,
                                                childrenInfo: Array<ActivityChildInfo>)
        : Promise<Array<Partial<HospitalVisitActivityEntity>>> {
        const children: Record<string, ChildEntity> = await this.getMapForChildrenByIds(childrenInfo);
        const groupId = randomUUID();
        return flatten(activitiesFromType.map(activity => childrenInfo.map(childInfo => ({
            ...activity,
            groupId,
            child: children[childInfo.childId],
            childId: childInfo.childId,
            isParentThere: childInfo.isParentThere,
        }))));
    }

    private async fillActivitiesWithVisit(entities: Array<Partial<HospitalVisitActivityEntity>>,
                                          visitId: string): Promise<void> {
        const visit = await this.visitDao.getOne(visitId);
        entities.forEach(entity => {
            entity.id = randomUUID();
            entity.hospitalVisit = visit;
        });
    }

    private async getMapForChildrenByIds(childInfos: Array<ActivityChildInfo>): Promise<Record<string, ChildEntity>> {
        const childIds = childInfos.map(c => c.childId);
        const childEntities: Array<ChildEntity> = await this.childDao.findByIds(childIds);
        this.verifyFoundChildForEveryId(childEntities, childIds);

        return childEntities.reduce<Record<string, ChildEntity>>(
            (result, child) => {
                result[child.id] = child;
                return result;
            }, {}
        );
    }

    private verifyFoundChildForEveryId(entities: Array<ChildEntity>, ids: Array<string>): void {
        const entityIds = entities.map(e => e.id);
        const diff = _.difference(ids, entityIds);
        if (isNotEmpty(diff)) {
            throw new BadRequestException(`No child found with these ids: ${diff.join(',')}`);
        }
    }

}
