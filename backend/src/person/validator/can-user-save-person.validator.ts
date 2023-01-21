import {Validator} from '@shared/validator/validator';
import {PersonCreation} from '@be/person/model/person-creation';
import {User} from '@shared/user/user';
import {isUserAnEmployee} from '@shared/user/role.enum';
import {ForbiddenException} from '@nestjs/common';


export class CanUserSavePersonValidator implements Validator<PersonCreation> {

    constructor(private readonly currentUser: User) {
    }

    public static of(user: User): CanUserSavePersonValidator {
        return new CanUserSavePersonValidator(user);
    }

    public validate(value: PersonCreation): void {
        if (!isUserAnEmployee(this.currentUser)) {
            throw new ForbiddenException('User has no permission to create new user');
        }
    }

}
