import {PersonEntity} from '@be/person/model/person.entity';
import {Person} from '@shared/person/person';
import {Injectable} from '@nestjs/common';
import {Converter} from '@shared/converter/converter';
import {PersonEntityToDtoConverter} from '@be/person/converer/person-entity-to-dto.converter';
import {User} from '@shared/user/user';
import {HidePersonSensitiveDataConverter} from '@be/person/converer/hide-person-sensitive-data.converter';
import {HidePersonCreateDataConverter} from '@be/person/converer/hide-person-create-data.converter';
import {ConverterChain} from '@shared/converter/converter-chain';
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
