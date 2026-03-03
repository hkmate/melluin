import {Injectable} from '@nestjs/common';
import {DepartmentCreateValidator, DepartmentRewriteValidator} from '@be/department/validator/department-validator';
import {DepartmentIsActiveValidator} from '@be/department/validator/department-is-active.validator';
import {ValidFromIsBeforeToValidator} from '@be/department/validator/valid-from-is-before-to.validator';

@Injectable()
export class DepartmentSaveValidatorFactory {

    public getValidatorsForCreate(): Array<DepartmentCreateValidator> {
        return [
            new ValidFromIsBeforeToValidator()
        ];
    }

    public getValidatorsForUpdate(): Array<DepartmentRewriteValidator> {
        return [
            new DepartmentIsActiveValidator(),
            new ValidFromIsBeforeToValidator()
        ];
    }

}
