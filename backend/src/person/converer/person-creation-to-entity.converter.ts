import {PersonEntity} from '@be/person/model/person.entity';
import {Injectable} from '@nestjs/common';
import {isNil} from '@shared/util/util';
import {Converter} from '@shared/converter';
import {PersonCreation} from '@shared/person/person-creation';
import {randomUUID} from 'crypto';

@Injectable()
export class PersonCreationToEntityConverter implements Converter<PersonCreation, PersonEntity> {

    public convert(value: PersonCreation): PersonEntity;
    public convert(value: undefined): undefined;
    public convert(entity?: PersonCreation): PersonEntity | undefined;
    public convert(entity?: PersonCreation): PersonEntity | undefined {
        if (isNil(entity)) {
            return undefined;
        }
        return this.convertNotNilEntity(entity);
    }

    private convertNotNilEntity(dto: PersonCreation): PersonEntity {
        return {
            id: randomUUID(),
            firstName: dto.firstName,
            lastName: dto.lastName,
            nickName: dto.nickName,
            email: dto.email,
            phone: dto.phone,
        } as PersonEntity;
    }

}
