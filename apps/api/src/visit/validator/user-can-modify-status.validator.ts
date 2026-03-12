import {ApiErrors, VisitRewrite, Permission, User, VisitStatuses} from '@melluin/common';
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
        const scheduling = entity.status === VisitStatuses.DRAFT
            && item.status === VisitStatuses.SCHEDULED;
        const fixing = entity.status === VisitStatuses.ACTIVITIES_FILLED_OUT
            && item.status === VisitStatuses.STARTED;
        const finalize = entity.status === VisitStatuses.ACTIVITIES_FILLED_OUT
            && item.status === VisitStatuses.ALL_FILLED_OUT;

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
            code: ApiErrors.STATUS_CHANGE_DISABLED
        });
    }

    private isStatusChangeNormalForVolunteer(entity: VisitEntity, item: VisitRewrite): boolean {
        const starting = entity.status === VisitStatuses.SCHEDULED
            && item.status === VisitStatuses.STARTED;
        const canceling = entity.status === VisitStatuses.SCHEDULED
            && (item.status === VisitStatuses.CANCELED
                || item.status === VisitStatuses.FAILED_FOR_OTHER_REASON
                || item.status === VisitStatuses.FAILED_BECAUSE_NO_CHILD);
        const ending = entity.status === VisitStatuses.STARTED
            && (item.status === VisitStatuses.ACTIVITIES_FILLED_OUT
                || item.status === VisitStatuses.CANCELED
                || item.status === VisitStatuses.FAILED_FOR_OTHER_REASON
                || item.status === VisitStatuses.FAILED_BECAUSE_NO_CHILD);
        return starting || ending || canceling;
    }

}
