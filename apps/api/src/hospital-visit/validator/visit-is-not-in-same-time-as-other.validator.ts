import {User} from '@shared/user/user';
import {BadRequestException, Injectable} from '@nestjs/common';
import {Permission} from '@shared/user/permission.enum';
import {VisitSaveValidator, VisitValidationData} from '@be/hospital-visit/validator/visit-validator';
import {HospitalVisitDao} from '@be/hospital-visit/hospital-visit.dao';
import {DepartmentDao} from '@be/department/department.dao';
import {HospitalVisitRewrite} from '@shared/hospital-visit/hospital-visit-rewrite';
import {HospitalVisitCreate} from '@shared/hospital-visit/hospital-visit-create';
import {ApiError} from '@shared/api-util/api-error';

@Injectable()
export class VisitIsNotInSameTimeAsOtherValidator implements VisitSaveValidator {

    constructor(private readonly departmentDao: DepartmentDao,
                private readonly visitDao: HospitalVisitDao) {
    }

    public validate(value: VisitValidationData): Promise<void> {
        if ('entity' in value && value.entity.department.id === value.item.departmentId) {
            return Promise.resolve();
        }

        return this.doValidate(value);
    }

    // eslint-disable-next-line max-lines-per-function
    private async doValidate({item, requester, sameTimeVisitForced}: VisitValidationData): Promise<void> {
        const department = await this.departmentDao.getOne(item.departmentId);
        if (item.vicariousMomVisit && !department.vicariousMomIncludedInLimit) {
            return;
        }
        const visitCount = await this.getSameLikeVisitCount(item, department.vicariousMomIncludedInLimit)

        if (visitCount < department.limitOfVisits) {
            return;
        }
        if (this.canUserForce(requester) && sameTimeVisitForced) {
            return;
        }
        throw new BadRequestException({
            message: 'Cannot have more visits at this time in this department.',
            code: ApiError.VISIT_SAME_TIME_SAME_DEPARTMENT_LIMIT_EXCEEDED
        });
    }

    private getSameLikeVisitCount(item: HospitalVisitRewrite | HospitalVisitCreate, vicariousMomVisitCounts: boolean): Promise<number> {
        return this.visitDao.countForSameTimeAndDepartment({
            from: item.dateTimeFrom,
            to: item.dateTimeTo,
            departmentId: item.departmentId,
            vicariousMomVisitIncluded: vicariousMomVisitCounts
        });
    }

    private canUserForce(user: User): boolean {
        return user.permissions.includes(Permission.canForceSameTimeVisitWrite);
    }

}
