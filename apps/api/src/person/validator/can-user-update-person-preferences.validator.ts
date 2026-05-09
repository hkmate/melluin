import {
    ApiErrors,
    createDefaultPersonPreferences,
    isNil,
    Permission,
    PermissionT,
    PersonPreferences,
    PersonRewrite,
    User
} from '@melluin/common';
import {ForbiddenException} from '@nestjs/common';
import {PersonEntity} from '@be/person/model/person.entity';
import {PersonRewriteValidator, PersonRewriteWithEntity} from '@be/person/validator/person-rewrite.validator';
import {isDeepEqual} from '@be/util/is-deep-equal';

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
        throw new ForbiddenException({
            message: 'You have no permission to update this person\'s preferences',
            code: ApiErrors.NO_PERMISSION_TO_UPDATE_PERSON_PREFERENCE
        });
    }

    private hasNoPreferenceChange(rewrite: PersonRewrite, person: PersonEntity): boolean {
        return (isNil(rewrite.preferences) && isNil(person.preferences))
            || isDeepEqual(rewrite.preferences, person.preferences)
            || (isNil(person.preferences) && this.isDefault(rewrite.preferences));
    }

    private isUserGotId(personId: string): boolean {
        return this.currentUser.personId === personId;
    }

    private userHas(permission: PermissionT): boolean {
        return this.currentUser.permissions.includes(permission);
    }

    private isDefault(preferences?: PersonPreferences): boolean {
        const def = createDefaultPersonPreferences();
        return isDeepEqual(preferences, def);
    }

}
