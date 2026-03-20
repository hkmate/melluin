import {PersonEntity} from '@be/person/model/person.entity';
import {Injectable} from '@nestjs/common';
import {Converter, isNil, PersonCreation, User} from '@melluin/common';
import {randomUUID} from 'crypto';

import {now} from '@be/util/now';

interface PersonCreationRequest {
    newPerson: PersonCreation,
    requester: User
}

@Injectable()
export class PersonCreationToEntityConverter implements Converter<PersonCreationRequest, PersonEntity> {

    public convert(value: PersonCreationRequest): PersonEntity;
    public convert(value: undefined): undefined;
    public convert(entity?: PersonCreationRequest): PersonEntity | undefined;
    public convert(entity?: PersonCreationRequest): PersonEntity | undefined {
        if (isNil(entity)) {
            return undefined;
        }
        return this.convertNotNilEntity(entity);
    }

    private convertNotNilEntity({ newPerson, requester }: PersonCreationRequest): PersonEntity {
        return {
            id: randomUUID(),
            firstName: newPerson.firstName,
            lastName: newPerson.lastName,
            email: newPerson.email,
            phone: newPerson.phone,
            created: now(),
            createdByPersonId: requester.personId,
            cities: newPerson.cities
        } as PersonEntity;
    }

}
