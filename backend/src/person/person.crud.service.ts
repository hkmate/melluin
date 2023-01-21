import {Injectable} from '@nestjs/common';
import {PersonDao} from '@be/person/person.dao';
import {Pageable, PageRequest} from '@shared/api-util/pageable';
import {Person} from '@shared/person/person';
import {PersonEntity} from '@be/person/model/person.entity';
import {PageConverter} from '@be/crud/convert/page.converter';
import {User} from '@shared/user/user';
import {PersonCreation} from '@be/person/model/person-creation';
import {PersonUpdate} from '@be/person/model/person-update';
import {PersonCreationToEntityConverter} from '@be/person/converer/person-creation-to-entity.converter';
import {PersonEntityToDtoConverter} from '@be/person/converer/person-entity-to-dto.converter';
import {CanUserSavePersonValidator} from '@be/person/validator/can-user-save-person.validator';
import {CanUserUpdatePersonValidator} from '@be/person/validator/can-user-update-person.validator';
import {PersonFieldsPageRequestValidator} from '@be/person/validator/person-fields-page-request.validator';

@Injectable()
export class PersonCrudService {

    constructor(private readonly personDao: PersonDao,
                private readonly personConverter: PersonEntityToDtoConverter,
                private readonly personPageRequestValidator: PersonFieldsPageRequestValidator,
                private readonly personCreationConverter: PersonCreationToEntityConverter) {
    }

    public async save(personCreation: PersonCreation, requester: User): Promise<Person> {
        CanUserSavePersonValidator
            .of(requester)
            .validate(personCreation);
        const creationEntity = this.personCreationConverter.convert(personCreation);
        const personEntity = await this.personDao.save(creationEntity);
        return this.personConverter.convert(personEntity);
    }

    public getOne(id: string): Promise<Person> {
        return this.personDao.getOne(id)
            .then(entity => this.personConverter.convert(entity))
    }

    public async find(pageRequest: PageRequest, requester: User): Promise<Pageable<Person>> {
        this.personPageRequestValidator.validate(pageRequest);

        // TODO: later when there are types of volunteering it will be needed to add restriction to the
        //  filters because user should not access those people who are not in his/her responsibility.

        const pageOfEntities: Pageable<PersonEntity> = await this.personDao.findAll(pageRequest);
        const pageConverter = PageConverter.of(this.personConverter);
        return pageConverter.convert(pageOfEntities);
    }

    public async update(personId: string, changeSet: PersonUpdate, requester: User): Promise<Person> {
        const person = await this.personDao.getOne(personId);
        CanUserUpdatePersonValidator
            .of(requester)
            .validate({personId, changeSet});

        this.applyChangesToEntity(person, changeSet);
        const savedPerson = await this.personDao.save(person);
        return this.personConverter.convert(savedPerson);
    }

    private applyChangesToEntity(entity: PersonEntity, changeSet: PersonUpdate): void {
        Object.keys(changeSet).forEach(changeKey => {
            entity[changeKey] = changeSet[changeKey];
        });
    }

}
