import {Module} from '@nestjs/common';
import {VisitCrudService} from '@be/visit/visit.crud.service';
import {VisitCreationToEntityConverter} from '@be/visit/converer/visit-creation-to-entity.converter';
import {VisitEntityToDtoConverter} from '@be/visit/converer/visit-entity-to-dto.converter';
import {VisitPersistenceModule} from '@be/visit/visit.persistence.module';
import {PersonModule} from '@be/person/person.module';
import {DepartmentModule} from '@be/department/department.module';
import {DepartmentPersistenceModule} from '@be/department/department.persistence.module';
import {DepartmentBoxModule} from '@be/department-box/department-box.module';
import {VisitRewriteApplierFactory} from '@be/visit/applier/visit-rewrite-applier.factory';
import {VisitIsNotInSameTimeAsOtherValidator} from '@be/visit/validator/visit-is-not-in-same-time-as-other.validator';
import {ParticipantsIsInOneVisitAtSameTimeValidator} from '@be/visit/validator/participants-is-in-one-visit-at-same-time.validator';
import {VisitSaveValidatorFactory} from '@be/visit/validator/visit-save-validator-factory';
import {ParticipantsAreWorkInCityAsDepartmentValidator} from '@be/visit/validator/participants-are-work-in-city-as-department.validator';
import {VisitIsInActiveDepartmentsValidator} from '@be/visit/validator/visit-is-in-active-departments.validator';
import {VisitController} from '@be/visit/api/visit.controller';

@Module({
    imports: [
        VisitPersistenceModule,
        PersonModule,
        DepartmentModule,
        DepartmentPersistenceModule,
        DepartmentBoxModule,
    ],
    providers: [
        VisitCreationToEntityConverter,
        VisitIsNotInSameTimeAsOtherValidator,
        ParticipantsIsInOneVisitAtSameTimeValidator,
        ParticipantsAreWorkInCityAsDepartmentValidator,
        VisitIsInActiveDepartmentsValidator,
        VisitEntityToDtoConverter,
        VisitRewriteApplierFactory,
        VisitCrudService,
        VisitSaveValidatorFactory
    ],
    exports: [
        VisitCreationToEntityConverter,
        VisitEntityToDtoConverter,
        VisitRewriteApplierFactory,
        VisitCrudService,
        VisitSaveValidatorFactory
    ],
    controllers: [
        VisitController,
    ]
})
export class VisitModule {
}
