import {Injectable} from '@nestjs/common';
import {ChildInput, Converter, isNil} from '@melluin/common';
import {randomUUID} from 'crypto';
import {ChildEntity} from '@be/child/model/child.entity';

@Injectable()
export class ChildInputToEntityConverter implements Converter<ChildInput, ChildEntity> {

    public convert(value: ChildInput): ChildEntity;
    public convert(value: undefined): undefined;
    public convert(entity?: ChildInput): ChildEntity | undefined;
    public convert(entity?: ChildInput): ChildEntity | undefined {
        if (isNil(entity)) {
            return undefined;
        }
        return this.convertNotNilEntity(entity);
    }

    private convertNotNilEntity(dto: ChildInput): ChildEntity {
        return {
            id: randomUUID(),
            name: dto.name,
            guessedBirth: dto.guessedBirth,
            info: dto.info ?? null
        };
    }

}
