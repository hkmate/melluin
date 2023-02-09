import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {FindOptionConverterModule} from '@be/find-option-converter/find-option-converter.module';
import {DepartmentEntity} from '@be/department/model/department.entity';
import {DepartmentDao} from '@be/department/department.dao';
import {DepartmentCrudService} from '@be/department/department.crud.service';
import {DepartmentEntityToDtoConverter} from '@be/department/converer/department-entity-to-dto.converter';
import {DepartmentCreationToEntityConverter} from '@be/department/converer/department-creation-to-entity.converter';
import {DepartmentController} from '@be/department/department.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            DepartmentEntity
        ]),

        FindOptionConverterModule,
    ],
    controllers: [
        DepartmentController
    ],
    providers: [
        DepartmentDao,
        DepartmentCrudService,
        DepartmentEntityToDtoConverter,
        DepartmentCreationToEntityConverter
    ],
    exports: []
})
export class DepartmentModule {
}
