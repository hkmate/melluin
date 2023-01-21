import {Validator} from '@shared/validator/validator';
import {User} from '@shared/user/user';
import {isUserAnEmployee} from '@shared/user/role.enum';
import {ForbiddenException} from '@nestjs/common';
import {PersonUpdate} from '@be/person/model/person-update';


interface ChangeSetWithId {
    personId: string,
    changeSet: PersonUpdate
}

export class CanUserUpdatePersonValidator implements Validator<ChangeSetWithId> {

    constructor(private readonly currentUser: User) {
    }

    public static of(user: User): CanUserUpdatePersonValidator {
        return new CanUserUpdatePersonValidator(user);
    }

    public validate({personId, changeSet}: ChangeSetWithId): void {
        if (!isUserAnEmployee(this.currentUser) && !this.isUserGotId(personId)) {
            throw new ForbiddenException('User has no permission to create new user');
        }
    }

    private isUserGotId(personId: string): boolean {
        return this.currentUser.id === personId;
    }

}
