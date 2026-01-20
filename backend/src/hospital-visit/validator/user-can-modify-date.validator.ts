import {User} from '@shared/user/user';
import {ForbiddenException} from '@nestjs/common';
import {Permission} from '@shared/user/permission.enum';
import {HospitalVisitRewriteValidationData, VisitRewriteValidator} from '@be/hospital-visit/validator/visit-validator';
import {ApiError} from '@shared/api-util/api-error';
import {HospitalVisitStatus} from '@shared/hospital-visit/hospital-visit-status';
import {HospitalVisitEntity} from '@be/hospital-visit/model/hospital-visit.entity';
import {HospitalVisitRewrite} from '@shared/hospital-visit/hospital-visit-rewrite';
import dayjs from 'dayjs';

export class UserCanModifyDateValidator implements VisitRewriteValidator {

    public validate(data: HospitalVisitRewriteValidationData): Promise<void> {
        if (this.isNoDateChange(data.entity, data.item)) {
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
        const inDraft = entity.status === HospitalVisitStatus.DRAFT;
        const isScheduled = entity.status === HospitalVisitStatus.SCHEDULED;
        const inStarted = entity.status === HospitalVisitStatus.STARTED;
        const inFilledOut = item.status === HospitalVisitStatus.ACTIVITIES_FILLED_OUT;
        const statusEnabled = inDraft || isScheduled || inStarted || inFilledOut;

        if (statusEnabled && this.isSameDayChange(entity, item)) {
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

    private throwError(): never {
        throw new ForbiddenException({
            message: 'User cannot perform this date time change',
            code: ApiError.VISIT_DATE_TIME_CHANGE_DISABLED
        });
    }

    private isNoDateChange(entity: HospitalVisitEntity, item: HospitalVisitRewrite): boolean {
        return dayjs(entity.dateTimeFrom).isSame(item.dateTimeFrom)
            && dayjs(entity.dateTimeTo).isSame(item.dateTimeTo);
    }

    private isStatusChangeNormalForVolunteer(entity: HospitalVisitEntity, item: HospitalVisitRewrite): boolean {
        const beforeStart = entity.status === HospitalVisitStatus.SCHEDULED;
        return beforeStart && this.isSameDayChange(entity, item);
    }

    private isSameDayChange(entity: HospitalVisitEntity, item: HospitalVisitRewrite): boolean {
        return dayjs(entity.dateTimeFrom).isSame(item.dateTimeFrom, 'day')
            && dayjs(entity.dateTimeTo).isSame(item.dateTimeTo, 'day');
    }

}
