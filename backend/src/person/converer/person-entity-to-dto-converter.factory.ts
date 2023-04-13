import {PersonEntity} from '@be/person/model/person.entity';
import {Person} from '@shared/person/person';
import {Injectable} from '@nestjs/common';
import {Converter} from '@shared/converter';
import {PersonEntityToDtoConverter} from '@be/person/converer/person-entity-to-dto.converter';
import {User} from '@shared/user/user';
import {HidePersonSensitiveDataConverter} from '@be/person/converer/hide-person-sensitive-data.converter';

@Injectable()
export class PersonEntityToDtoConverterFactory {

    constructor(private readonly personConverter: PersonEntityToDtoConverter) {
    }

    public createFor(requester: User): Converter<PersonEntity, Person> {
        const hideConverter = new HidePersonSensitiveDataConverter(requester);
        const personConverter = this.personConverter;
        return {
            convert(value: PersonEntity): Person {
                return hideConverter.convert(
                    personConverter.convert(value)
                );
            }
        } as Converter<PersonEntity, Person>
    }

}
