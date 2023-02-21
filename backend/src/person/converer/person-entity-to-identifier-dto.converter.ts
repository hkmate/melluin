import {PersonEntity} from '@be/person/model/person.entity';
import {PersonIdentifier} from '@shared/person/person';
import {Injectable} from '@nestjs/common';
import {isNil} from '@shared/util/util';
import {Converter} from '@shared/converter';

@Injectable()
export class PersonEntityToIdentifierDtoConverter implements Converter<PersonEntity, PersonIdentifier> {


    public convert(value: PersonEntity): PersonIdentifier;
    public convert(value: undefined): undefined;
    public convert(entity?: PersonEntity): PersonIdentifier | undefined;
    public convert(entity?: PersonEntity): PersonIdentifier | undefined {
        if (isNil(entity)) {
            return undefined;
        }
        return this.convertNotNilEntity(entity);
    }

    private convertNotNilEntity(entity: PersonEntity): PersonIdentifier {
        return {
            id: entity.id,
            firstName: entity.firstName,
            lastName: entity.lastName,
            nickName: entity.nickName,
        } satisfies PersonIdentifier;
    }

}
