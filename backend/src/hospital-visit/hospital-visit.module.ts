import {Module} from '@nestjs/common';
import {HospitalVisitController} from '@be/hospital-visit/hospital-visit.controller';
import {HospitalVisitCrudService} from '@be/hospital-visit/hospital-visit.crud.service';
import {HospitalVisitCreationToEntityConverter} from '@be/hospital-visit/converer/hospital-visit-creation-to-entity.converter';
import {HospitalVisitEntityToDtoConverter} from '@be/hospital-visit/converer/hospital-visit-entity-to-dto.converter';
import {HospitalVisitPersistenceModule} from '@be/hospital-visit/hospital-visit.persistence.module';
import {PersonModule} from '@be/person/person.module';
import {DepartmentModule} from '@be/department/department.module';
import {DepartmentPersistenceModule} from '@be/department/department.persistence.module';
import {DepartmentBoxModule} from '@be/department-box/department-box.module';
import {HospitalVisitRewriteApplierFactory} from '@be/hospital-visit/applier/hospital-visit-rewrite-applier.factory';
import {VisitIsNotInSameTimeAsOtherValidator} from '@be/hospital-visit/validator/visit-is-not-in-same-time-as-other.validator';
import {ParticipantsIsInOneVisitAtSameTimeValidator} from '@be/hospital-visit/validator/participants-is-in-one-visit-at-same-time.validator';
import {VisitSaveValidatorFactory} from '@be/hospital-visit/validator/visit-save-validator-factory';

@Module({
    imports: [
        HospitalVisitPersistenceModule,
        PersonModule,
        DepartmentModule,
        DepartmentPersistenceModule,
        DepartmentBoxModule,
    ],
    providers: [
        HospitalVisitCreationToEntityConverter,
        VisitIsNotInSameTimeAsOtherValidator,
        ParticipantsIsInOneVisitAtSameTimeValidator,
        HospitalVisitEntityToDtoConverter,
        HospitalVisitRewriteApplierFactory,
        HospitalVisitCrudService,
        VisitSaveValidatorFactory
    ],
    exports: [
        HospitalVisitCreationToEntityConverter,
        HospitalVisitEntityToDtoConverter,
        HospitalVisitRewriteApplierFactory,
        HospitalVisitCrudService,
        VisitSaveValidatorFactory
    ],
    controllers: [
        HospitalVisitController,
    ]
})
export class HospitalVisitModule {
}
