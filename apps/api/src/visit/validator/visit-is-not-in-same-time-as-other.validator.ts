import {ApiErrors, Permission, User, VisitCreate, VisitRewrite} from '@melluin/common';
import {BadRequestException, Injectable} from '@nestjs/common';
import {VisitSaveValidator, VisitValidationData} from '@be/visit/validator/visit-validator';
import {VisitDao} from '@be/visit/visit.dao';
import {DepartmentDao} from '@be/department/department.dao';

@Injectable()
export class VisitIsNotInSameTimeAsOtherValidator implements VisitSaveValidator {

    constructor(private readonly departmentDao: DepartmentDao,
                private readonly visitDao: VisitDao) {
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
            code: ApiErrors.VISIT_SAME_TIME_SAME_DEPARTMENT_LIMIT_EXCEEDED
        });
    }

    private getSameLikeVisitCount(item: VisitRewrite | VisitCreate, vicariousMomVisitCounts: boolean): Promise<number> {
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
