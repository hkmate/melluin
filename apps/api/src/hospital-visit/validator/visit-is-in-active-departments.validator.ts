import {VisitSaveValidator, VisitValidationData} from '@be/hospital-visit/validator/visit-validator';
import {DepartmentDao} from '@be/department/department.dao';
import {BadRequestException, Injectable} from '@nestjs/common';
import {DepartmentEntity} from '@be/department/model/department.entity';
import dayjs from 'dayjs';
import {ApiError} from '@shared/api-util/api-error';

@Injectable()
export class VisitIsInActiveDepartmentsValidator implements VisitSaveValidator {

    constructor(private readonly departmentDao: DepartmentDao) {
    }

    public async validate(data: VisitValidationData): Promise<void> {
        const department = await this.getDepartment(data);
        const visit = data.item;
        if (dayjs(visit.dateTimeFrom).isAfter(department.validFrom)
            && dayjs(visit.dateTimeTo).isBefore(department.validTo)) {
            return;
        }
        throw new BadRequestException({
            message: 'Visit is at time when department is invalid',
            code: ApiError.VISIT_IS_IN_INACTIVE_DEPARTMENT
        })
    }

    private getDepartment(data: VisitValidationData): Promise<DepartmentEntity> {
        if ('entity' in data) {
            if (data.entity.department.id === data.item.departmentId) {
                return Promise.resolve(data.entity.department);
            }
        }
        return this.departmentDao.getOne(data.item.departmentId);
    }

}
