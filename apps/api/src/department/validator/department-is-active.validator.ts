import {BadRequestException} from '@nestjs/common';
import {ApiError, DateUtil, isNil} from '@melluin/common';
import {
    DepartmentRewriteValidationData,
    DepartmentRewriteValidator
} from '@be/department/validator/department-validator';


export class DepartmentIsActiveValidator implements DepartmentRewriteValidator {

    public validate({entity}: DepartmentRewriteValidationData): Promise<void> {
        if (isNil(entity.validTo)) {
            return Promise.resolve();
        }
        if (entity.validTo < DateUtil.now()) {
            throw new BadRequestException({
                message: 'Department could not be changed because it is not valid anymore',
                code: ApiError.DEPARTMENT_IS_NOT_ACTIVE
            });
        }
        return Promise.resolve();
    }

}
