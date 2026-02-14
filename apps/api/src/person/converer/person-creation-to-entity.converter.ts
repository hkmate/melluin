import { PersonEntity } from '@be/person/model/person.entity';
import { Injectable } from '@nestjs/common';
import { isNil } from '@shared/util/util';
import { Converter } from '@shared/converter/converter';
import { PersonCreation } from '@shared/person/person-creation';
import { randomUUID } from 'crypto';
import { now } from '@be/util/util';
import { User } from '@shared/user/user';

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
