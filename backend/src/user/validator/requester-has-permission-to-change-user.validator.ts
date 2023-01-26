import {Validator} from '@shared/validator/validator';
import {User} from '@shared/user/user';
import {isUserAnEmployee, Role} from '@shared/user/role.enum';
import {ForbiddenException} from '@nestjs/common';
import {UserEntity} from '@be/user/model/user.entity';
import {UserUpdate} from '@shared/user/user-update';
import {includeAny, isNil} from '@shared/util/util';

interface ChangeSetWithEntity {
    entity: UserEntity,
    changeSet: UserUpdate
}

export class RequesterHasPermissionToChangeUserValidator implements Validator<ChangeSetWithEntity> {


    constructor(private readonly currentUser: User) {
    }

    public static of(user: User): RequesterHasPermissionToChangeUserValidator {
        return new RequesterHasPermissionToChangeUserValidator(user);
    }

    public validate(value: ChangeSetWithEntity): void {
        if (!isUserAnEmployee(this.currentUser)) {
            throw new ForbiddenException('User has no permission to create new user');
        }
        if (!this.arePredicatesValid(value)) {
            throw new ForbiddenException('You have no permission to create new user with these roles');
        }
    }

    private arePredicatesValid(changeSetWithEntity: ChangeSetWithEntity): boolean {
        return [
            this.isCurrentUserSysadminOrAdmin(),
            this.isCurrentUserChangesSelfOnAllowedFields(changeSetWithEntity)
        ].includes(true);
    }

    private isCurrentUserSysadminOrAdmin(): boolean {
        return includeAny(this.currentUser.roles, Role.SYSADMIN, Role.ADMINISTRATOR);
    }

    private isCurrentUserChangesSelfOnAllowedFields({entity, changeSet}: ChangeSetWithEntity): boolean {
        return this.currentUser.id === entity.id
            && isNil(changeSet.isActive);
    }

}
