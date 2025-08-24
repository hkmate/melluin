import {Injectable} from '@nestjs/common';
import {isNil} from '@shared/util/util';
import {Converter} from '@shared/converter/converter';
import {randomUUID} from 'crypto';
import {VisitedChildEntity} from '@be/hospital-visit-children/persistence/model/visited-child.entity';
import {VisitedChildCreation} from '@be/hospital-visit-children/converer/visited-child-creation';
import {ChildDao} from '@be/child/child.dao';


@Injectable()
export class VisitedChildCreationToEntityConverter
    implements Converter<VisitedChildCreation, Promise<VisitedChildEntity>> {

    constructor(private readonly childDao: ChildDao) {
    }

    public convert(value: VisitedChildCreation): Promise<VisitedChildEntity>;
    public convert(value: undefined): undefined;
    public convert(entity?: VisitedChildCreation): Promise<VisitedChildEntity> | undefined;
    public convert(entity?: VisitedChildCreation): Promise<VisitedChildEntity> | undefined {
        if (isNil(entity)) {
            return undefined;
        }
        return this.convertNotNilEntity(entity);
    }

    private async convertNotNilEntity(dto: VisitedChildCreation): Promise<VisitedChildEntity> {
        const childEntity = await this.childDao.getOne(dto.visitedChildInput.childId);

        return {
            id: randomUUID(),
            visitId: dto.visit.id,
            child: childEntity,
            isParentThere: dto.visitedChildInput.isParentThere
        };
    }

}
