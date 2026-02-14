import {User} from '@shared/user/user';
import {ForbiddenException} from '@nestjs/common';
import {isNil} from '@shared/util/util';
import {ConjunctionFilterOptions, FilterOptions} from '@shared/api-util/filter-options';
import {PageRequest} from '@be/crud/page-request';
import {PageRequestValidator} from '@be/crud/validator/page-request.validator';
import {Permission} from '@shared/user/permission.enum';

export class CanUserPerformFindValidator implements PageRequestValidator {

    constructor(private readonly currentUser: User) {
    }

    public static of(user: User): CanUserPerformFindValidator {
        return new CanUserPerformFindValidator(user);
    }

    public validate(pageReq: PageRequest): void {
        if (isNil(pageReq.where)) {
            return;
        }
        if (this.hasNoEmailFilter(pageReq.where) && this.hasNoPhoneFilter(pageReq.where)) {
            return;
        }

        if (this.isUserEmployee()) {
            return;
        }
        throw new ForbiddenException('You have no permission to find on email or phone data');
    }

    private hasNoEmailFilter(filter: FilterOptions): boolean {
        return this.hasNoFieldFilter(filter, 'email');
    }

    private hasNoPhoneFilter(filter: FilterOptions): boolean {
        return this.hasNoFieldFilter(filter, 'phone');
    }

    private hasNoFieldFilter(filter: FilterOptions, fieldName: string): boolean {
        if (Array.isArray(filter)) {
            return filter.some(item => this.hasNoFieldFilterOption(item, fieldName));
        }
        return this.hasNoFieldFilterOption(filter, fieldName);
    }

    private hasNoFieldFilterOption(filter: ConjunctionFilterOptions, fieldName: string): boolean {
        return isNil(filter[fieldName]);
    }

    private isUserEmployee(): boolean {
        return this.currentUser.permissions.includes(Permission.canReadSensitivePersonData);
    }

}
