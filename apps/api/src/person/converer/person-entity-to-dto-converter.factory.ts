import {PersonEntity} from '@be/person/model/person.entity';
import {Converter, ConverterChain, Person, User} from '@melluin/common';
import {Injectable} from '@nestjs/common';
import {PersonEntityToDtoConverter} from '@be/person/converer/person-entity-to-dto.converter';
import {HidePersonSensitiveDataConverter} from '@be/person/converer/hide-person-sensitive-data.converter';
import {HidePersonCreateDataConverter} from '@be/person/converer/hide-person-create-data.converter';
import {HidePersonBriefUserLastLoginDataConverter} from '@be/person/converer/hide-person-brief-user-last-login-data.converter';

@Injectable()
export class PersonEntityToDtoConverterFactory {

    constructor(private readonly personConverter: PersonEntityToDtoConverter) {
    }

    public createFor(requester: User): Converter<PersonEntity, Person> {
        return ConverterChain.of(
            this.personConverter,
            new HidePersonSensitiveDataConverter(requester),
            new HidePersonCreateDataConverter(requester),
            new HidePersonBriefUserLastLoginDataConverter(requester),
        );
    }

}
