import {Validator} from '@shared/validator/validator';
import {User} from '@shared/user/user';
import {isUserHasAnyRoleOf, Role} from '@shared/user/role.enum';
import {ForbiddenException} from '@nestjs/common';
import {DepartmentCreation} from '@shared/department/department-creation';
import {DepartmentUpdateChangeSet} from '@shared/department/department-update-change-set';


export class CanUserManageDepartmentValidator implements Validator<DepartmentCreation | DepartmentUpdateChangeSet> {

    private static readonly ROLE_WHO_COULD_SAVE_DEPARTMENT = [
        Role.SYSADMIN, Role.ADMINISTRATOR, Role.HOSPITAL_VISIT_COORDINATOR
    ];

    constructor(private readonly currentUser: User) {
    }

    public static of(user: User): CanUserManageDepartmentValidator {
        return new CanUserManageDepartmentValidator(user);
    }

    public validate(value?: DepartmentCreation | DepartmentUpdateChangeSet): void {
        if (!isUserHasAnyRoleOf(this.currentUser, CanUserManageDepartmentValidator.ROLE_WHO_COULD_SAVE_DEPARTMENT)) {
            throw new ForbiddenException('User has no permission to manage departments');
        }
    }

}
