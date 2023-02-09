import {Module} from '@nestjs/common';
import {DepartmentCrudService} from '@be/department/department.crud.service';
import {DepartmentEntityToDtoConverter} from '@be/department/converer/department-entity-to-dto.converter';
import {DepartmentCreationToEntityConverter} from '@be/department/converer/department-creation-to-entity.converter';
import {DepartmentController} from '@be/department/department.controller';
import {DepartmentPersistenceModule} from '@be/department/department.persistence.module';
import {DepartmentBoxModule} from '@be/department-box/department-box.module';

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
        DepartmentCreationToEntityConverter
    ],
    exports: []
})
export class DepartmentModule {
}
