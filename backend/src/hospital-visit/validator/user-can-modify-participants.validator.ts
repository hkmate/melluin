import {User} from '@shared/user/user';
import {ForbiddenException} from '@nestjs/common';
import {Permission} from '@shared/user/permission.enum';
import {HospitalVisitRewriteValidationData, VisitRewriteValidator} from '@be/hospital-visit/validator/visit-validator';
import {ApiError} from '@shared/api-util/api-error';
import {HospitalVisitStatus} from '@shared/hospital-visit/hospital-visit-status';

export class UserCanModifyParticipantsValidator implements VisitRewriteValidator {

    public validate(data: HospitalVisitRewriteValidationData): Promise<void> {
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

    private verifyCoordinatorChangeIsValid({item}: HospitalVisitRewriteValidationData): void | never {
        const inDraft = item.status === HospitalVisitStatus.DRAFT;
        const isScheduled = item.status === HospitalVisitStatus.SCHEDULED;
        const inStarted = item.status === HospitalVisitStatus.STARTED;
        const inFilledOut = item.status === HospitalVisitStatus.ACTIVITIES_FILLED_OUT;

        if (inDraft || isScheduled || inStarted || inFilledOut) {
            return;
        }
        this.throwError();
    }

    private verifyVolunteerChangeIsValid({item, entity}: HospitalVisitRewriteValidationData): void | never {
        const isScheduled = entity.status === HospitalVisitStatus.SCHEDULED
            || item.status === HospitalVisitStatus.SCHEDULED;

        if (isScheduled) {
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

    private throwError(): never {
        throw new ForbiddenException({
            message: 'User cannot perform this participant change',
            code: ApiError.VISIT_PARTICIPANT_CHANGE_DISABLED
        });
    }

}
