import {PersonEntity} from '@be/person/model/person.entity';
import {Person} from '@shared/person/person';
import {Injectable} from '@nestjs/common';
import {isNil} from '@shared/util/util';
import {Converter} from '@shared/converter';
import {UserEntityToDtoConverter} from '@be/user/converter/user-entity-to-dto.converter';

@Injectable()
export class PersonEntityToDtoConverter implements Converter<PersonEntity, Person> {

    constructor(private readonly userConverter: UserEntityToDtoConverter) {
    }

    public convert(value: PersonEntity): Person;
    public convert(value: undefined): undefined;
    public convert(entity?: PersonEntity): Person | undefined;
    public convert(entity?: PersonEntity): Person | undefined {
        if (isNil(entity)) {
            return undefined;
        }
        return this.convertNotNilEntity(entity);
    }

    private convertNotNilEntity(entity: PersonEntity): Person {
        return {
            id: entity.id,
            user: this.userConverter.convert(entity.user),
            email: entity.email,
            firstName: entity.firstName,
            lastName: entity.lastName,
            phone: entity.phone,
            nickName: entity.nickName
        } satisfies Person;
    }

}
