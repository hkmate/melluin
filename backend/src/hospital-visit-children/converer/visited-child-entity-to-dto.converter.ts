import {Injectable} from '@nestjs/common';
import {isNil} from '@shared/util/util';
import {Converter} from '@shared/converter';
import {VisitedChildEntity} from '@be/hospital-visit-children/persistence/model/visited-child.entity';
import {VisitedChild} from '@shared/hospital-visit/visited-child';
import {ChildEntityToDtoConverter} from '@be/child/converer/child-entity-to-dto.converter';

@Injectable()
export class VisitedChildEntityToDtoConverter implements Converter<VisitedChildEntity, VisitedChild> {

    constructor(private readonly childConverter: ChildEntityToDtoConverter) {
    }

    public convert(value: VisitedChildEntity): VisitedChild;
    public convert(value: undefined): undefined;
    public convert(entity?: VisitedChildEntity): VisitedChild | undefined;
    public convert(entity?: VisitedChildEntity): VisitedChild | undefined {
        if (isNil(entity)) {
            return undefined;
        }
        return this.convertNotNilEntity(entity);
    }

    private convertNotNilEntity(entity: VisitedChildEntity): VisitedChild {
        return {
            id: entity.id,
            child: this.childConverter.convert(entity.child),
            visitId: entity.visitId,
            isParentThere: entity.isParentThere
        }
    }

}
