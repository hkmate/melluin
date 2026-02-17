import {ApiError, VisitStatus, Permission, User} from '@melluin/common';
import {ForbiddenException} from '@nestjs/common';
import {VisitRewriteValidationData, VisitRewriteValidator} from '@be/visit/validator/visit-validator';

export class UserCanModifyVicariousMomFlagValidator implements VisitRewriteValidator {

    public validate(data: VisitRewriteValidationData): Promise<void> {
        if (data.entity.vicariousMomVisit === data.item.vicariousMomVisit) {
            return Promise.resolve();
        }
        if (this.canUserModifyAnyVisitUnrestricted(data.requester)) {
            return Promise.resolve();
        }
        if (this.canUserModifyAnyVisit(data.requester)) {
            this.verifyCoordinatorChangeIsValid(data);
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

    private verifyCoordinatorChangeIsValid({entity}: VisitRewriteValidationData): void | never {
        const inDraft = entity.status === VisitStatus.DRAFT;
        const isScheduled = entity.status === VisitStatus.SCHEDULED;
        const inStarted = entity.status === VisitStatus.STARTED;
        const inFilledOut = entity.status === VisitStatus.ACTIVITIES_FILLED_OUT;

        if (inDraft || isScheduled || inStarted || inFilledOut) {
            return;
        }
        this.throwError();
    }

    private throwError(): never {
        throw new ForbiddenException({
            message: 'User cannot perform change on vicariousMom field',
            code: ApiError.VICARIOUS_MOM_CHANGE_DISABLED
        });
    }

}
