import { Injectable } from '@nestjs/common';
import { PersonDao } from '@be/person/person.dao';
import { Pageable } from '@shared/api-util/pageable';
import { Person } from '@shared/person/person';
import { PersonEntity } from '@be/person/model/person.entity';
import { PageConverter } from '@be/crud/convert/page.converter';
import { User } from '@shared/user/user';
import { PersonCreation } from '@shared/person/person-creation';
import { PersonRewrite } from '@shared/person/person-rewrite';
import { PersonCreationToEntityConverter } from '@be/person/converer/person-creation-to-entity.converter';
import {
    CanUserUpdatePersonPrimitiveFieldsValidator,
} from '@be/person/validator/can-user-update-person-primitive-fields.validator';
import { PageRequest } from '@be/crud/page-request';
import { PageRequestFieldsValidator } from '@be/crud/validator/page-request-fields.validator';
import { personFilterableFields, personSortableFields } from '@shared/person/person-filterable-fields';
import { PersonRewriteApplierFactory } from '@be/person/applier/person-rewrite-applier.factory';
import { PersonRewriteValidator } from '@be/person/validator/person-rewrite.validator';
import { ValidatorChain } from '@shared/validator/validator-chain';
import {
    CanUserUpdatePersonPreferencesValidator,
} from '@be/person/validator/can-user-update-person-preferences.validator';
import { PersonEntityToDtoConverterFactory } from '@be/person/converer/person-entity-to-dto-converter.factory';
import { CanUserPerformFindValidator } from '@be/person/validator/can-user-perform-find.validator';
import { PageRequestValidator } from '@be/crud/validator/page-request.validator';

@Injectable()
export class PersonCrudService {

    constructor(private readonly personDao: PersonDao,
                private readonly personConverterFactory: PersonEntityToDtoConverterFactory,
                private readonly personCreationConverter: PersonCreationToEntityConverter,
                private readonly rewriteApplierFactory: PersonRewriteApplierFactory,
    ) {
    }

    public async save(personCreation: PersonCreation, requester: User): Promise<Person> {
        const creationEntity = this.personCreationConverter.convert({ newPerson: personCreation, requester });
        // TODO: refactor it to async validator
        await this.personDao.verifyEmailIsNotUsedYet(personCreation.email);

        const personEntity = await this.personDao.save(creationEntity);
        return this.personConverterFactory.createFor(requester)
            .convert(personEntity);
    }

    public getOne(id: string, requester: User): Promise<Person> {
        return this.personDao.getOne(id)
            .then(entity => this.personConverterFactory.createFor(requester)
                .convert(entity));
    }

    public async find(pageRequest: PageRequest, requester: User): Promise<Pageable<Person>> {
        this.createValidatorsForPage(requester)
            .validate(pageRequest);

        const pageOfEntities: Pageable<PersonEntity> = await this.personDao.findAll(pageRequest);
        const pageConverter = PageConverter.of(this.personConverterFactory.createFor(requester));
        return pageConverter.convert(pageOfEntities);
    }

    public async update(personId: string, personRewrite: PersonRewrite, requester: User): Promise<Person> {
        const person = await this.personDao.getOne(personId);
        this.createValidatorsForUpdate(requester)
            .validate({ person, rewrite: personRewrite });

        // TODO: refactor it to async validator
        await this.personDao.verifyEmailIsNotUsedYetByOther(personRewrite.email, personId);

        const changeApplier = this.rewriteApplierFactory.createFor(personRewrite, person);
        const savedPerson = await this.personDao.save(changeApplier.applyChanges());
        return this.personConverterFactory.createFor(requester)
            .convert(savedPerson);
    }

    private createValidatorsForUpdate(requester: User): PersonRewriteValidator {
        return ValidatorChain.of(
            CanUserUpdatePersonPrimitiveFieldsValidator.of(requester),
            CanUserUpdatePersonPreferencesValidator.of(requester),
        );
    }

    private createValidatorsForPage(requester: User): PageRequestValidator {
        return ValidatorChain.of(
            PageRequestFieldsValidator.of(personSortableFields, personFilterableFields),
            CanUserPerformFindValidator.of(requester),
        );
    }

}
