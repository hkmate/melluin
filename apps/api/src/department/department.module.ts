import {Module} from '@nestjs/common';
import {DepartmentCrudService} from '@be/department/department.crud.service';
import {DepartmentEntityToDtoConverter} from '@be/department/converer/department-entity-to-dto.converter';
import {DepartmentCreationToEntityConverter} from '@be/department/converer/department-creation-to-entity.converter';
import {DepartmentPersistenceModule} from '@be/department/department.persistence.module';
import {DepartmentBoxModule} from '@be/department-box/department-box.module';
import {DepartmentController} from '@be/department/api/department.controller';
import {DepartmentRewriteApplierFactory} from '@be/department/applier/department-rewrite-applier.factory';
import {DepartmentSaveValidatorFactory} from '@be/department/validator/department-save-validator-factory';

@Module({
    imports: [
        DepartmentPersistenceModule,
        DepartmentBoxModule
    ],
    controllers: [
        DepartmentController
    ],
    providers: [
        DepartmentCrudService,
        DepartmentEntityToDtoConverter,
        DepartmentCreationToEntityConverter,
        DepartmentRewriteApplierFactory,
        DepartmentSaveValidatorFactory
    ],
    exports: [
        DepartmentCrudService,
        DepartmentEntityToDtoConverter
    ]
})
export class DepartmentModule {
}
