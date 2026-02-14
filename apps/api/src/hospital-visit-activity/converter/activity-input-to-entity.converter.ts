import {Injectable} from '@nestjs/common';
import {isNil} from '@shared/util/util';
import {Converter} from '@shared/converter/converter';
import {HospitalVisitActivityInput} from '@shared/hospital-visit-activity/hospital-visit-activity-input';
import {HospitalVisitActivityEntity} from '@be/hospital-visit-activity/model/hospital-visit-activity.entity';
import {HospitalVisitDao} from '@be/hospital-visit/hospital-visit.dao';
import {randomUUID} from 'crypto';
import {VisitedChildVerifierService} from '@be/hospital-visit-children/service/visited-child-verifier.service';
import {VisitedChildrenDao} from '@be/hospital-visit-children/persistence/visited-children.dao';

@Injectable()
export class ActivityInputToEntityConverter
    implements Converter<HospitalVisitActivityInput, Promise<HospitalVisitActivityEntity>> {

    constructor(private readonly visitDao: HospitalVisitDao,
                private readonly visitedChildDao: VisitedChildrenDao,
                private readonly childVerifier: VisitedChildVerifierService) {
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
        await this.childVerifier.verifyEveryChildIdExists(dto.children);
        const visit = await this.visitDao.getOne(dto.visitId!);
        const visitedChildren = await this.visitedChildDao.findAllByIds(dto.children);
        return {
            id: randomUUID(),
            activities: dto.activities,
            children: visitedChildren,
            comment: dto.comment,
            hospitalVisit: visit
        };
    }

}
