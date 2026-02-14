import {User} from '@shared/user/user';
import {ForbiddenException} from '@nestjs/common';
import {PersonRewrite} from '@shared/person/person-rewrite';
import {PersonEntity} from '@be/person/model/person.entity';
import {Permission} from '@shared/user/permission.enum';
import {isNil} from '@shared/util/util';
import * as _ from 'lodash';
import {PersonRewriteValidator, PersonRewriteWithEntity} from '@be/person/validator/person-rewrite.validator';

export class CanUserUpdateCityValidator implements PersonRewriteValidator {

    constructor(private readonly currentUser: User) {
    }

    public static of(user: User): CanUserUpdateCityValidator {
        return new CanUserUpdateCityValidator(user);
    }

    public validate({person, rewrite}: PersonRewriteWithEntity): void {
        if (this.hasNoChange(rewrite, person)) {
            return;
        }

        if (this.userHas(Permission.canModifyPersonCity)) {
            return;
        }
        throw new ForbiddenException('You have no permission to update this person\'s operation cities');
    }

    private hasNoChange(rewrite: PersonRewrite, person: PersonEntity): boolean {
        return (isNil(rewrite.cities) && isNil(person.cities))
            || _.isEqual(rewrite.cities, person.cities);
    }

    private userHas(permission: Permission): boolean {
        return this.currentUser.permissions.includes(permission);
    }

}
