import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersonEntity } from './model/person.entity';
import { PersonController } from '@be/person/api/person.controller';
import { PersonCrudService } from '@be/person/person.crud.service';
import { FindOptionConverterModule } from '@be/find-option-converter/find-option-converter.module';
import { PersonDao } from '@be/person/person.dao';
import { PersonEntityToDtoConverter } from '@be/person/converer/person-entity-to-dto.converter';
import { PersonCreationToEntityConverter } from '@be/person/converer/person-creation-to-entity.converter';
import { UserEntityToDtoModule } from '@be/user/user-entity-to-dto.module';
import { PersonEntityToIdentifierDtoConverter } from '@be/person/converer/person-entity-to-identifier-dto.converter';
import { PersonRewriteApplierFactory } from '@be/person/applier/person-rewrite-applier.factory';
import { PersonEntityToDtoConverterFactory } from '@be/person/converer/person-entity-to-dto-converter.factory';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            PersonEntity,
        ]),

        UserEntityToDtoModule,
        FindOptionConverterModule,
    ],
    controllers: [PersonController],
    providers: [
        PersonDao,
        PersonCrudService,
        PersonEntityToDtoConverter,
        PersonCreationToEntityConverter,
        PersonEntityToIdentifierDtoConverter,
        PersonRewriteApplierFactory,
        PersonEntityToDtoConverterFactory,
    ],
    exports: [
        PersonDao,
        PersonCrudService,
        PersonEntityToDtoConverter,
        PersonEntityToIdentifierDtoConverter,
        PersonRewriteApplierFactory,
        PersonEntityToDtoConverterFactory,
    ],
})
export class PersonModule {
}
