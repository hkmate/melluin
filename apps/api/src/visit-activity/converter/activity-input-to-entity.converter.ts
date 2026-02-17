import {Injectable} from '@nestjs/common';
import {Converter, VisitActivityInput, isNil} from '@melluin/common';
import {VisitActivityEntity} from '@be/visit-activity/model/visit-activity.entity';
import {VisitDao} from '@be/visit/visit.dao';
import {randomUUID} from 'crypto';
import {VisitedChildVerifierService} from '@be/visit-children/service/visited-child-verifier.service';
import {VisitedChildrenDao} from '@be/visit-children/persistence/visited-children.dao';

@Injectable()
export class ActivityInputToEntityConverter
    implements Converter<VisitActivityInput, Promise<VisitActivityEntity>> {

    constructor(private readonly visitDao: VisitDao,
                private readonly visitedChildDao: VisitedChildrenDao,
                private readonly childVerifier: VisitedChildVerifierService) {
    }

    public convert(value: VisitActivityInput): Promise<VisitActivityEntity>;
    public convert(value: undefined): undefined;
    public convert(value?: VisitActivityInput): Promise<VisitActivityEntity> | undefined;
    public convert(value?: VisitActivityInput): Promise<VisitActivityEntity> | undefined {
        if (isNil(value)) {
            return undefined;
        }
        return this.convertNotNil(value);
    }

    private async convertNotNil(dto: VisitActivityInput): Promise<VisitActivityEntity> {
        await this.childVerifier.verifyEveryChildIdExists(dto.children);
        const visit = await this.visitDao.getOne(dto.visitId!);
        const visitedChildren = await this.visitedChildDao.findAllByIds(dto.children);
        return {
            id: randomUUID(),
            activities: dto.activities,
            children: visitedChildren,
            comment: dto.comment,
            visit: visit
        };
    }

}
