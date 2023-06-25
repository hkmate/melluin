import {Injectable} from '@nestjs/common';
import {isNil} from '@shared/util/util';
import {Converter} from '@shared/converter';
import {HospitalVisitActivityInput} from '@shared/hospital-visit-activity/hospital-visit-activity-input';
import {HospitalVisitActivityEntity} from '@be/hospital-visit-activity/model/hospital-visit-activity.entity';
import {HospitalVisitDao} from '@be/hospital-visit/hospital-visit.dao';
import {randomUUID} from 'crypto';
import {ChildVerifierService} from '@be/child/child-verifier.service';

@Injectable()
export class ActivityInputToEntityConverter
    implements Converter<HospitalVisitActivityInput, Promise<HospitalVisitActivityEntity>> {

    constructor(private readonly visitDao: HospitalVisitDao,
                private readonly childVerifier: ChildVerifierService) {
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
        await this.childVerifier.verifyEveryChildIdExists(dto.children.map(c => c.childId));
        const visit = await this.visitDao.getOne(dto.visitId!);
        return {
            id: randomUUID(),
            activities: dto.activities,
            children: dto.children,
            comment: dto.comment,
            hospitalVisit: visit
        };
    }

}
