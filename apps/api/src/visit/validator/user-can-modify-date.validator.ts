import {ApiError, VisitRewrite, VisitStatus, Permission, User} from '@melluin/common';
import {ForbiddenException} from '@nestjs/common';
import {VisitRewriteValidationData, VisitRewriteValidator} from '@be/visit/validator/visit-validator';
import {VisitEntity} from '@be/visit/model/visit.entity';
import dayjs from 'dayjs';

export class UserCanModifyDateValidator implements VisitRewriteValidator {

    public validate(data: VisitRewriteValidationData): Promise<void> {
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

    private verifyCoordinatorChangeIsValid({entity, item}: VisitRewriteValidationData): void | never {
        const inDraft = entity.status === VisitStatus.DRAFT;
        const isScheduled = entity.status === VisitStatus.SCHEDULED;
        if (inDraft || isScheduled) {
            return;
        }
        const inStarted = entity.status === VisitStatus.STARTED;
        const inFilledOut = item.status === VisitStatus.ACTIVITIES_FILLED_OUT;
        const statusEnabled = inStarted || inFilledOut;

        if (statusEnabled && this.isSameDayChange(entity, item)) {
            return;
        }
        this.throwError();
    }

    private verifyVolunteerChangeIsValid({entity, item}: VisitRewriteValidationData): void | never {
        if (this.isChangeNormalForVolunteer(entity, item)) {
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

    private isNoDateChange(entity: VisitEntity, item: VisitRewrite): boolean {
        return dayjs(entity.dateTimeFrom).isSame(item.dateTimeFrom)
            && dayjs(entity.dateTimeTo).isSame(item.dateTimeTo)
            && entity.countedMinutes === item.countedMinutes;
    }

    private isChangeNormalForVolunteer(entity: VisitEntity, item: VisitRewrite): boolean {
        const beforeStart = entity.status === VisitStatus.SCHEDULED;
        const inStarted = entity.status === VisitStatus.STARTED;
        return (beforeStart || inStarted) && this.isSameDayChange(entity, item);
    }

    private isSameDayChange(entity: VisitEntity, item: VisitRewrite): boolean {
        return dayjs(entity.dateTimeFrom).isSame(item.dateTimeFrom, 'day')
            && dayjs(entity.dateTimeTo).isSame(item.dateTimeTo, 'day');
    }

}
