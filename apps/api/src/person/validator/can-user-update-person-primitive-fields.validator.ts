import {User} from '@shared/user/user';
import {ForbiddenException} from '@nestjs/common';
import {PersonEntity} from '@be/person/model/person.entity';
import {Permission} from '@shared/user/permission.enum';
import {PersonRewriteValidator, PersonRewriteWithEntity} from '@be/person/validator/person-rewrite.validator';
import {isNil} from '@shared/util/util';
import {getPermissionsNeededToChangeRole} from '@shared/user/role';


export class CanUserUpdatePersonPrimitiveFieldsValidator implements PersonRewriteValidator {

    constructor(private readonly currentUser: User) {
    }

    public static of(user: User): CanUserUpdatePersonPrimitiveFieldsValidator {
        return new CanUserUpdatePersonPrimitiveFieldsValidator(user);
    }

    public validate({person, rewrite}: PersonRewriteWithEntity): void {
        if (this.isUserGotId(person.id) && this.userHas(Permission.canWriteSelf)) {
            return;
        }
        if (this.hasUserPermissionToChangePerson(person)) {
            return;
        }
        throw new ForbiddenException('You have no permission to update this person');
    }

    private hasUserPermissionToChangePerson(person: PersonEntity): boolean {
        if (isNil(person.user)) {
            return true;
        }
        return person.user?.roles.every(role => {
            const neededPermission = getPermissionsNeededToChangeRole(role.type);
            return this.userHas(neededPermission);
        }) ?? false;
    }

    private isUserGotId(personId: string): boolean {
        return this.currentUser.personId === personId;
    }

    private userHas(permission: Permission): boolean {
        return this.currentUser.permissions.includes(permission);
    }

}
