import {Injectable} from '@nestjs/common';
import {Pageable} from '@shared/api-util/pageable';
import {PageConverter} from '@be/crud/convert/page.converter';
import {User} from '@shared/user/user';
import {PageRequest} from '@be/crud/page-request';
import {PageRequestFieldsValidator} from '@be/crud/validator/page-request-fields.validator';
import {DepartmentBoxStatusDao} from '@be/department-box/department-box-status.dao';
import {DepartmentBoxStatusReport} from '@shared/department/box/department-box-status-report';
import {DepartmentBoxStatusEntity} from '@be/department-box/model/department-box-status.entity';
import {BoxStatusWithDepartmentBrief, DepartmentBoxStatus} from '@shared/department/box/department-box-status';
import {BoxStatusReportToEntityConverter} from '@be/department-box/converer/box-status-report-to-entity.converter';
import {BoxStatusEntityToDtoConverter} from '@be/department-box/converer/box-status-entity-to-dto.converter';
import {
    departmentBoxStatusFilterableFields,
    departmentBoxStatusSortableFields
} from '@shared/department/box/department-box-status-filterable-fields';
import {BoxStatusInfoParam} from '@be/department-box/constants/box-status-info-param';
import {BoxStatusEntityToDtoWithDepartmentBriefConverter} from '@be/department-box/converer/box-status-entity-to-dto-with-department-brief.converter';
import {Converter} from '@shared/converter';

@Injectable()
export class DepartmentBoxStatusCrudService {

    constructor(private readonly departmentBoxDao: DepartmentBoxStatusDao,
                private readonly boxStatusConverter: BoxStatusEntityToDtoConverter,
                private readonly boxStatusWithDepBriefConverter: BoxStatusEntityToDtoWithDepartmentBriefConverter,
                private readonly boxStatusReportConverter: BoxStatusReportToEntityConverter) {
    }

    public async save(departmentId: string,
                      boxStatusReport: DepartmentBoxStatusReport,
                      requester: User): Promise<DepartmentBoxStatus> {
        const creationEntity = await this.boxStatusReportConverter.convert({
            departmentId: departmentId, report: boxStatusReport
        });
        const boxStatusEntity = await this.departmentBoxDao.save(creationEntity);
        return this.boxStatusConverter.convert(boxStatusEntity);
    }

    public async findByVisit(visitId: string, infoParam: BoxStatusInfoParam): Promise<Array<DepartmentBoxStatus>> {
        const entities: Array<DepartmentBoxStatusEntity> = await this.departmentBoxDao.findByVisit(visitId);
        const converter = this.getConverter(infoParam);
        return entities.map(e => converter.convert(e));
    }

    public async findByDepartment(departmentId: string, pageRequest: PageRequest, infoParam: BoxStatusInfoParam): Promise<Pageable<DepartmentBoxStatus>> {
        PageRequestFieldsValidator
            .of(departmentBoxStatusSortableFields, departmentBoxStatusFilterableFields)
            .validate(pageRequest);

        const pageOfEntities: Pageable<DepartmentBoxStatusEntity>
            = await this.departmentBoxDao.findByDepartment(departmentId, pageRequest);
        const pageConverter = PageConverter.of(this.getConverter(infoParam));
        return pageConverter.convert(pageOfEntities);
    }

    public async findAll(pageRequest: PageRequest, infoParam: BoxStatusInfoParam): Promise<Pageable<DepartmentBoxStatus>> {
        PageRequestFieldsValidator
            .of(departmentBoxStatusSortableFields, departmentBoxStatusFilterableFields)
            .validate(pageRequest);

        const pageOfEntities: Pageable<DepartmentBoxStatusEntity>
            = await this.departmentBoxDao.find(pageRequest);
        const pageConverter = PageConverter.of(this.getConverter(infoParam));
        return pageConverter.convert(pageOfEntities);
    }

    private getConverter(infoParam: BoxStatusInfoParam): Converter<DepartmentBoxStatusEntity, DepartmentBoxStatus>
        | Converter<DepartmentBoxStatusEntity, BoxStatusWithDepartmentBrief> {
        if (infoParam === BoxStatusInfoParam.WITH_DEPARTMENT_BRIEF) {
            return this.boxStatusWithDepBriefConverter;
        }
        return this.boxStatusConverter;
    }

}
