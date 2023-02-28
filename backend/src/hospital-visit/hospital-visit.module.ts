import {Module} from '@nestjs/common';
import {HospitalVisitController} from '@be/hospital-visit/hospital-visit.controller';
import {HospitalVisitCrudService} from '@be/hospital-visit/hospital-visit.crud.service';
import {HospitalVisitRewriteApplierFactory} from '@be/hospital-visit/converer/hospital-visit-rewrite-applier.factory';
import {HospitalVisitCreationToEntityConverter} from '@be/hospital-visit/converer/hospital-visit-creation-to-entity.converter';
import {HospitalVisitEntityToDtoConverter} from '@be/hospital-visit/converer/hospital-visit-entity-to-dto.converter';
import {HospitalVisitPersistenceModule} from '@be/hospital-visit/hospital-visit.persistence.module';
import {PersonModule} from '@be/person/person.module';
import {DepartmentModule} from '@be/department/department.module';
import {DepartmentPersistenceModule} from '@be/department/department.persistence.module';

@Module({
    imports: [
        HospitalVisitPersistenceModule,
        PersonModule,
        DepartmentModule,
        DepartmentPersistenceModule
    ],
    providers: [
        HospitalVisitCreationToEntityConverter,
        HospitalVisitEntityToDtoConverter,
        HospitalVisitRewriteApplierFactory,
        HospitalVisitCrudService,
    ],
    exports: [
        HospitalVisitCreationToEntityConverter,
        HospitalVisitEntityToDtoConverter,
        HospitalVisitRewriteApplierFactory,
        HospitalVisitCrudService
    ],
    controllers: [
        HospitalVisitController
    ]
})
export class HospitalVisitModule {
}
