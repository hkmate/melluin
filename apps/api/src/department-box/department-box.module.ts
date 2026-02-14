import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {FindOptionConverterModule} from '@be/find-option-converter/find-option-converter.module';
import {DepartmentBoxStatusEntity} from '@be/department-box/model/department-box-status.entity';
import {DepartmentBoxStatusDao} from '@be/department-box/department-box-status.dao';
import {DepartmentPersistenceModule} from '@be/department/department.persistence.module';
import {DepartmentBoxStatusCrudService} from '@be/department-box/department-box-status.crud.service';
import {BoxStatusEntityToDtoConverter} from '@be/department-box/converer/box-status-entity-to-dto.converter';
import {BoxStatusReportToEntityConverter} from '@be/department-box/converer/box-status-report-to-entity.converter';
import {DepartmentBoxStatusController} from '@be/department-box/api/department-box-status.controller';
import {BoxStatusEntityToDtoWithDepartmentBriefConverter} from '@be/department-box/converer/box-status-entity-to-dto-with-department-brief.converter';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            DepartmentBoxStatusEntity
        ]),

        FindOptionConverterModule,
        DepartmentPersistenceModule,
    ],
    providers: [
        DepartmentBoxStatusDao,
        DepartmentBoxStatusCrudService,
        BoxStatusEntityToDtoConverter,
        BoxStatusReportToEntityConverter,
        BoxStatusEntityToDtoWithDepartmentBriefConverter
    ],
    controllers: [DepartmentBoxStatusController],
    exports: [DepartmentBoxStatusCrudService]
})
export class DepartmentBoxModule {
}
