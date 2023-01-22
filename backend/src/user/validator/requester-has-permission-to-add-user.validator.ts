import {Validator} from '@shared/validator/validator';
import {User} from '@shared/user/user';
import {isUserAnEmployee, Role} from '@shared/user/role.enum';
import {ForbiddenException} from '@nestjs/common';
import {UserCreation} from '@be/user/model/user-creation';

export class RequesterHasPermissionToAddUserValidator implements Validator<UserCreation> {


    constructor(private readonly currentUser: User) {
    }

    public static of(user: User): RequesterHasPermissionToAddUserValidator {
        return new RequesterHasPermissionToAddUserValidator(user);
    }

    public validate(value: UserCreation): void {
        if (!isUserAnEmployee(this.currentUser)) {
            throw new ForbiddenException('User has no permission to create new user');
        }
        if (!this.arePredicatesValid(value)) {
            throw new ForbiddenException('You have no permission to create new user with these roles');
        }
    }

    private arePredicatesValid(userCreation: UserCreation): boolean {
        return [
            this.isCurrentUserSysadmin(),
            this.isCurrentUserAdminAndNewIsNotSysAdminOrAdmin(userCreation),
            this.isCurrentUserCoordinatorAndNewIsNotEmployee(userCreation)
        ].includes(true);
    }

    private isCurrentUserSysadmin(): boolean {
        return this.currentUser.roles.includes(Role.SYSADMIN)
    }

    private isCurrentUserAdminAndNewIsNotSysAdminOrAdmin(newUser: UserCreation): boolean {
        return this.currentUser.roles.includes(Role.ADMINISTRATOR)
            && (!newUser.roles.includes(Role.SYSADMIN) || !newUser.roles.includes(Role.ADMINISTRATOR));
    }

    private isCurrentUserCoordinatorAndNewIsNotEmployee(newUser: UserCreation): boolean {
        return this.currentUser.roles.includes(Role.HOSPITAL_VISIT_COORDINATOR)
            && !isUserAnEmployee(newUser);
    }

}
