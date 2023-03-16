import {BadRequestException, Injectable} from '@nestjs/common';
import {isNil, isNotEmpty} from '@shared/util/util';
import {Converter} from '@shared/converter';
import {
    ActivityChildInfo,
    HospitalVisitActivityInput
} from '@shared/hospital-visit-activity/hospital-visit-activity-input';
import {HospitalVisitActivityEntity} from '@be/hospital-visit-activity/model/hospital-visit-activity.entity';
import {HospitalVisitDao} from '@be/hospital-visit/hospital-visit.dao';
import {ChildDao} from '@be/child/child.dao';
import * as _ from 'lodash';
import {randomUUID} from 'crypto';

@Injectable()
export class ActivityInputToEntityConverter
    implements Converter<HospitalVisitActivityInput, Promise<HospitalVisitActivityEntity>> {

    constructor(private readonly visitDao: HospitalVisitDao,
                private readonly childDao: ChildDao) {
    }

    public convert(value: HospitalVisitActivityInput): Promise<HospitalVisitActivityEntity>;
    public convert(value: undefined): undefined;
    public convert(value?: HospitalVisitActivityInput): Promise<HospitalVisitActivityEntity> | undefined;
    public convert(value?: HospitalVisitActivityInput): Promise<HospitalVisitActivityEntity> | undefined {
        if (isNil(value)) {
            return undefined;
        }
        return this.convertNotNil(value);
    }

    private async convertNotNil(dto: HospitalVisitActivityInput): Promise<HospitalVisitActivityEntity> {
        await this.verifyEveryChildIdExists(dto.children);
        const visit = await this.visitDao.getOne(dto.visitId!);
        return {
            id: randomUUID(),
            activities: dto.activities,
            children: dto.children,
            comment: dto.comment,
            hospitalVisit: visit
        };
    }

    private async verifyEveryChildIdExists(childInfos: Array<ActivityChildInfo>): Promise<void> {
        const childIds = childInfos.map(c => c.childId);
        const persistedChildIds: Array<string> = await this.childDao.findIdByIds(childIds);
        this.verifyFoundChildForEveryId(persistedChildIds, childIds);
    }

    private verifyFoundChildForEveryId(entityIds: Array<string>, ids: Array<string>): void {
        const diff = _.difference(ids, entityIds);
        if (isNotEmpty(diff)) {
            throw new BadRequestException(`No child found with these ids: ${diff.join(',')}`);
        }
    }

}
