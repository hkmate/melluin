import {BadRequestException} from '@nestjs/common';
import {ApiError, isNil} from '@melluin/common';
import {DepartmentSaveValidator, DepartmentValidationData} from '@be/department/validator/department-validator';

export class ValidFromIsBeforeToValidator implements DepartmentSaveValidator {

    public validate({item}: DepartmentValidationData): Promise<void> {
        if (isNil(item.validTo)) {
            return Promise.resolve();
        }
        if (item.validFrom > item.validTo) {
            throw new BadRequestException({
                message: 'Department validTo could not be before validFrom',
                code: ApiError.DEPARTMENT_VALID_FROM_CANNOT_BE_AFTER_VALID_TO
            });
        }
        return Promise.resolve();
    }

}
