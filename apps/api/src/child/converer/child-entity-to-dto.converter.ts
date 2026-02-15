import {Injectable} from '@nestjs/common';
import {Child, Converter, isNil} from '@melluin/common';
import {ChildEntity} from '@be/child/model/child.entity';

@Injectable()
export class ChildEntityToDtoConverter implements Converter<ChildEntity, Child> {

    public convert(value: ChildEntity): Child;
    public convert(value: undefined): undefined;
    public convert(entity?: ChildEntity): Child | undefined;
    public convert(entity?: ChildEntity): Child | undefined {
        if (isNil(entity)) {
            return undefined;
        }
        return this.convertNotNilEntity(entity);
    }

    private convertNotNilEntity(entity: ChildEntity): Child {
        return {
            id: entity.id,
            name: entity.name,
            guessedBirth: entity.guessedBirth,
            info: entity.info ?? undefined
        }
    }

}
