import {User} from '@shared/user/user';
import {ForbiddenException} from '@nestjs/common';
import {PersonRewrite} from '@shared/person/person-rewrite';
import {PersonEntity} from '@be/person/model/person.entity';
import {Permission} from '@shared/user/permission.enum';
import {isNil} from '@shared/util/util';
import * as _ from 'lodash';
import {PersonRewriteValidator, PersonRewriteWithEntity} from '@be/person/validator/person-rewrite.validator';
import {PersonPreferences} from '@shared/person/person';

export class CanUserUpdatePersonPreferencesValidator implements PersonRewriteValidator {

    constructor(private readonly currentUser: User) {
    }

    public static of(user: User): CanUserUpdatePersonPreferencesValidator {
        return new CanUserUpdatePersonPreferencesValidator(user);
    }

    public validate({person, rewrite}: PersonRewriteWithEntity): void {
        if (this.hasNoPreferenceChange(rewrite, person)) {
            return;
        }

        if (this.isUserGotId(person.id) && this.userHas(Permission.canWriteSelf)) {
            return;
        }
        throw new ForbiddenException('You have no permission to update this person\'s preferences');
    }

    private hasNoPreferenceChange(rewrite: PersonRewrite, person: PersonEntity): boolean {
        return (isNil(rewrite.preferences) && isNil(person.preferences))
            || _.isEqual(rewrite.preferences, person.preferences)
            || (isNil(person.preferences) && this.isDefault(rewrite.preferences));
    }

    private isUserGotId(personId: string): boolean {
        return this.currentUser.personId === personId;
    }

    private userHas(permission: Permission): boolean {
        return this.currentUser.permissions.includes(permission);
    }

    private isDefault(preferences?: PersonPreferences): boolean {
        const def = PersonPreferences.createDefault();
        return _.isEqual(preferences, def);
    }

}
