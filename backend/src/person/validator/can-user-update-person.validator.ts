import {Validator} from '@shared/validator/validator';
import {User} from '@shared/user/user';
import {ForbiddenException} from '@nestjs/common';
import {PersonUpdate} from '@shared/person/person-update';
import {PersonEntity} from '@be/person/model/person.entity';
import {Permission} from '@shared/user/permission.enum';
import {getPermissionsNeededToChangeRole} from '@shared/user/role.enum';


interface ChangeSetWithEntity {
    person: PersonEntity,
    changeSet: PersonUpdate
}

export class CanUserUpdatePersonValidator implements Validator<ChangeSetWithEntity> {

    constructor(private readonly currentUser: User) {
    }

    public static of(user: User): CanUserUpdatePersonValidator {
        return new CanUserUpdatePersonValidator(user);
    }

    public validate({person, changeSet}: ChangeSetWithEntity): void {
        if (this.isUserGotId(person.id) && this.userHas(Permission.canWriteSelf)) {
            return;
        }
        if (this.hasUserPermissionToChangePerson(person)) {
            return;
        }
        throw new ForbiddenException('You have no permission to update this person');
    }

    private hasUserPermissionToChangePerson(person: PersonEntity): boolean {
        return person.user?.roles.every(role => {
            const neededPermission = getPermissionsNeededToChangeRole(role.role);
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
