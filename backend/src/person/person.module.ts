import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {PersonEntity} from './model/person.entity';
import {PersonController} from '@be/person/person.controller';
import {PersonCrudService} from '@be/person/person.crud.service';
import {FindOptionConverterModule} from '@be/find-option-converter/find-option-converter.module';
import {PersonDao} from '@be/person/person.dao';
import {PersonEntityToDtoConverter} from '@be/person/converer/person-entity-to-dto.converter';
import {UserModule} from '@be/user/user.module';
import {PersonFieldsPageRequestValidator} from '@be/person/validator/person-fields-page-request.validator';
import {PersonCreationToEntityConverter} from '@be/person/converer/person-creation-to-entity.converter';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            PersonEntity
        ]),

        UserModule,
        FindOptionConverterModule,
    ],
    controllers: [PersonController],
    providers: [
        PersonDao,
        PersonCrudService,
        PersonEntityToDtoConverter,
        PersonCreationToEntityConverter,
        PersonFieldsPageRequestValidator
    ],
    exports: [
        PersonDao,
        PersonCrudService
    ]
})
export class PersonModule {
}
