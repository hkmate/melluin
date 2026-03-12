import {ApiErrors, VisitRewrite, Permission, User, VisitStatuses} from '@melluin/common';
import {ForbiddenException} from '@nestjs/common';
import {VisitRewriteValidationData, VisitRewriteValidator} from '@be/visit/validator/visit-validator';
import {VisitEntity} from '@be/visit/model/visit.entity';

export class UserCanModifyDepartmentValidator implements VisitRewriteValidator {

    public validate(data: VisitRewriteValidationData): Promise<void> {
        if (this.isNoDepartmentChange(data.entity, data.item)) {
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

    private verifyCoordinatorChangeIsValid({item}: VisitRewriteValidationData): void | never {
        const inDraft = item.status === VisitStatuses.DRAFT;
        const isScheduled = item.status === VisitStatuses.SCHEDULED;
        const inStarted = item.status === VisitStatuses.STARTED;
        const inFilledOut = item.status === VisitStatuses.ACTIVITIES_FILLED_OUT;

        if (inDraft || isScheduled || inStarted || inFilledOut) {
            return;
        }
        this.throwError();
    }

    private verifyVolunteerChangeIsValid({item}: VisitRewriteValidationData): void | never {
        const isScheduled = item.status === VisitStatuses.SCHEDULED;

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

    private isNoDepartmentChange(entity: VisitEntity, item: VisitRewrite): boolean {
        return entity.department.id === item.departmentId;
    }

    private throwError(): never {
        throw new ForbiddenException({
            message: 'User cannot perform this department change',
            code: ApiErrors.DEPARTMENT_CHANGE_DISABLED
        });
    }

}
