import {Injectable} from '@nestjs/common';
import {Pageable} from '@shared/api-util/pageable';
import {PageConverter} from '@be/crud/convert/page.converter';
import {User} from '@shared/user/user';
import {PageRequest} from '@be/crud/page-request';
import {CanUserManageDepartmentValidator} from '@be/department/validator/can-user-manage-department.validator';
import {PageRequestFieldsValidator} from '@be/crud/validator/page-request-fields.validator';
import {DepartmentBoxStatusDao} from '@be/department-box/department-box-status.dao';
import {DepartmentBoxStatusReport} from '@shared/department/box/department-box-status-report';
import {DepartmentBoxStatusEntity} from '@be/department-box/model/department-box-status.entity';
import {DepartmentBoxStatus} from '@shared/department/box/department-box-status';
import {BoxStatusReportToEntityConverter} from '@be/department-box/converer/box-status-report-to-entity.converter';
import {BoxStatusEntityToDtoConverter} from '@be/department-box/converer/box-status-entity-to-dto.converter';
import {
    departmentBoxStatusFilterableFields,
    departmentBoxStatusSortableFields
} from '@shared/department/box/department-box-status-filterable-fields';

@Injectable()
export class DepartmentBoxStatusCrudService {

    constructor(private readonly departmentBoxDao: DepartmentBoxStatusDao,
                private readonly boxStatusConverter: BoxStatusEntityToDtoConverter,
                private readonly boxStatusReportConverter: BoxStatusReportToEntityConverter) {
    }

    public async save(departmentId: string,
                      boxStatusReport: DepartmentBoxStatusReport,
                      requester: User): Promise<DepartmentBoxStatus> {
        CanUserManageDepartmentValidator
            .of(requester)
            .validate();
        const creationEntity = await this.boxStatusReportConverter.convert({
            departmentId: departmentId, report: boxStatusReport
        });
        const boxStatusEntity = await this.departmentBoxDao.save(creationEntity);
        return this.boxStatusConverter.convert(boxStatusEntity);
    }

    public async find(departmentId: string, pageRequest: PageRequest, requester: User): Promise<Pageable<DepartmentBoxStatus>> {
        PageRequestFieldsValidator
            .of(departmentBoxStatusSortableFields, departmentBoxStatusFilterableFields)
            .validate(pageRequest);

        const pageOfEntities: Pageable<DepartmentBoxStatusEntity>
            = await this.departmentBoxDao.findAll(departmentId, pageRequest);
        const pageConverter = PageConverter.of(this.boxStatusConverter);
        return pageConverter.convert(pageOfEntities);
    }

}
