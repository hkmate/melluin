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
        HospitalVisitController,
    ]
})
export class HospitalVisitModule {
}
