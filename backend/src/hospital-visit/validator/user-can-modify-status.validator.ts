import {User} from '@shared/user/user';
import {ForbiddenException} from '@nestjs/common';
import {Permission} from '@shared/user/permission.enum';
import {HospitalVisitRewriteValidationData, VisitRewriteValidator} from '@be/hospital-visit/validator/visit-validator';
import {ApiError} from '@shared/api-util/api-error';
import {HospitalVisitStatus} from '@shared/hospital-visit/hospital-visit-status';
import {HospitalVisitEntity} from '@be/hospital-visit/model/hospital-visit.entity';
import {HospitalVisitRewrite} from '@shared/hospital-visit/hospital-visit-rewrite';

export class UserCanModifyStatusValidator implements VisitRewriteValidator {

    public validate(data: HospitalVisitRewriteValidationData): Promise<void> {
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

    private verifyCoordinatorChangeIsValid({entity, item}: HospitalVisitRewriteValidationData): void | never {
        const scheduling = entity.status === HospitalVisitStatus.DRAFT
            && item.status === HospitalVisitStatus.SCHEDULED;
        const fixing = entity.status === HospitalVisitStatus.ACTIVITIES_FILLED_OUT
            && item.status === HospitalVisitStatus.STARTED;
        const finalize = entity.status === HospitalVisitStatus.ACTIVITIES_FILLED_OUT
            && item.status === HospitalVisitStatus.ALL_FILLED_OUT;

        if (this.isStatusChangeNormalForVolunteer(entity, item) || scheduling || fixing || finalize) {
            return;
        }
        this.throwError();
    }

    private verifyVolunteerChangeIsValid({entity, item}: HospitalVisitRewriteValidationData): void | never {
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

    private isNoStatusChange(entity: HospitalVisitEntity, item: HospitalVisitRewrite): boolean {
        return entity.status === item.status;
    }

    private throwError(): never {
        throw new ForbiddenException({
            message: 'User cannot perform this status change',
            code: ApiError.STATUS_CHANGE_DISABLED
        });
    }

    private isStatusChangeNormalForVolunteer(entity: HospitalVisitEntity, item: HospitalVisitRewrite): boolean {
        const starting = entity.status === HospitalVisitStatus.SCHEDULED
            && item.status === HospitalVisitStatus.STARTED;
        const canceling = entity.status === HospitalVisitStatus.SCHEDULED
            && (item.status === HospitalVisitStatus.CANCELED
                || item.status === HospitalVisitStatus.FAILED_FOR_OTHER_REASON
                || item.status === HospitalVisitStatus.FAILED_BECAUSE_NO_CHILD);
        const ending = entity.status === HospitalVisitStatus.STARTED
            && (item.status === HospitalVisitStatus.ACTIVITIES_FILLED_OUT
                || item.status === HospitalVisitStatus.CANCELED
                || item.status === HospitalVisitStatus.FAILED_FOR_OTHER_REASON
                || item.status === HospitalVisitStatus.FAILED_BECAUSE_NO_CHILD);
        return starting || ending || canceling;
    }

}
