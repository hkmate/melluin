import {PersonEntity} from '@be/person/model/person.entity';
import {Person} from '@shared/person/person';
import {Injectable} from '@nestjs/common';
import {isNil} from '@shared/util/util';
import {Converter} from '@shared/converter';
import {UserEntityToBriefDtoConverter} from '@be/user/converter/user-entity-to-brief-dto.converter';

@Injectable()
export class PersonEntityToDtoConverter implements Converter<PersonEntity, Person> {

    constructor(private readonly userConverter: UserEntityToBriefDtoConverter) {
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
            firstName: entity.firstName,
            lastName: entity.lastName,
            nickName: entity.nickName,
            email: entity.email,
            phone: entity.phone,
        } satisfies Person;
    }

}
