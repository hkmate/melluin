import {User} from '@shared/user/user';
import {ForbiddenException} from '@nestjs/common';
import {Permission} from '@shared/user/permission.enum';
import {HospitalVisitRewriteValidationData, VisitRewriteValidator} from '@be/hospital-visit/validator/visit-validator';
import {ApiError} from '@shared/api-util/api-error';

export class UserCanModifyVicariousMomFlagValidator implements VisitRewriteValidator {

    public validate(data: HospitalVisitRewriteValidationData): Promise<void> {
        if (data.entity.vicariousMomVisit === data.item.vicariousMomVisit) {
            return Promise.resolve();
        }
        if (this.canUserModifyAnyVisitUnrestricted(data.requester) || this.canUserModifyAnyVisit(data.requester)) {
            return Promise.resolve();
        }
        return this.throwError();
    }

    private canUserModifyAnyVisit(user: User): boolean {
        return user.permissions.includes(Permission.canModifyAnyVisit);
    }

    private canUserModifyAnyVisitUnrestricted(user: User): boolean {
        return user.permissions.includes(Permission.canModifyAnyVisitUnrestricted);
    }

    private throwError(): never {
        throw new ForbiddenException({
            message: 'User cannot perform change on vicariousMom field',
            code: ApiError.VICARIOUS_MOM_CHANGE_DISABLED
        });
    }

}
