import {ApiError, VisitRewrite, VisitStatus, Permission, User} from '@melluin/common';
import {ForbiddenException} from '@nestjs/common';
import {VisitRewriteValidationData, VisitRewriteValidator} from '@be/visit/validator/visit-validator';
import {VisitEntity} from '@be/visit/model/visit.entity';

export class UserCanModifyStatusValidator implements VisitRewriteValidator {

    public validate(data: VisitRewriteValidationData): Promise<void> {
        if (this.isNoStatusChange(data.entity, data.item)) {
            return Promise.resolve();
        }
        if (this.canUserModifyAnyVisitUnrestricted(data.requester)) {
            return Promise.resolve();
        }
        if (this.canUserModifyAnyVisit(data.requester)) {
            this.verifyCoordinatorChangeIsValid(data);
            return Promise.resolve();
        }

        this.verifyVolunteerChangeIsValid(data);
        return Promise.resolve();
    }

    private verifyCoordinatorChangeIsValid({entity, item}: VisitRewriteValidationData): void | never {
        const scheduling = entity.status === VisitStatus.DRAFT
            && item.status === VisitStatus.SCHEDULED;
        const fixing = entity.status === VisitStatus.ACTIVITIES_FILLED_OUT
            && item.status === VisitStatus.STARTED;
        const finalize = entity.status === VisitStatus.ACTIVITIES_FILLED_OUT
            && item.status === VisitStatus.ALL_FILLED_OUT;

        if (this.isStatusChangeNormalForVolunteer(entity, item) || scheduling || fixing || finalize) {
            return;
        }
        this.throwError();
    }

    private verifyVolunteerChangeIsValid({entity, item}: VisitRewriteValidationData): void | never {
        if (this.isStatusChangeNormalForVolunteer(entity, item)) {
            return;
        }
        this.throwError();
    }

    private canUserModifyAnyVisit(user: User): boolean {
        return user.permissions.includes(Permission.canModifyAnyVisit);
    }

    private canUserModifyAnyVisitUnrestricted(user: User): boolean {
        return user.permissions.includes(Permission.canModifyAnyVisitUnrestricted);
    }

    private isNoStatusChange(entity: VisitEntity, item: VisitRewrite): boolean {
        return entity.status === item.status;
    }

    private throwError(): never {
        throw new ForbiddenException({
            message: 'User cannot perform this status change',
            code: ApiError.STATUS_CHANGE_DISABLED
        });
    }

    private isStatusChangeNormalForVolunteer(entity: VisitEntity, item: VisitRewrite): boolean {
        const starting = entity.status === VisitStatus.SCHEDULED
            && item.status === VisitStatus.STARTED;
        const canceling = entity.status === VisitStatus.SCHEDULED
            && (item.status === VisitStatus.CANCELED
                || item.status === VisitStatus.FAILED_FOR_OTHER_REASON
                || item.status === VisitStatus.FAILED_BECAUSE_NO_CHILD);
        const ending = entity.status === VisitStatus.STARTED
            && (item.status === VisitStatus.ACTIVITIES_FILLED_OUT
                || item.status === VisitStatus.CANCELED
                || item.status === VisitStatus.FAILED_FOR_OTHER_REASON
                || item.status === VisitStatus.FAILED_BECAUSE_NO_CHILD);
        return starting || ending || canceling;
    }

}
