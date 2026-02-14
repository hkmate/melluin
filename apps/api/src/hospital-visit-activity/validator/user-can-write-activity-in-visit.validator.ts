import {User} from '@shared/user/user';
import {ForbiddenException} from '@nestjs/common';
import {Permission} from '@shared/user/permission.enum';
import {ApiError} from '@shared/api-util/api-error';
import {VisitedChildBasicValidationData} from '@be/hospital-visit-children/validator/visited-child-validator';
import {
    VisitActivityBasicValidationData,
    VisitActivityBasicValidator
} from '@be/hospital-visit-activity/validator/visit-activity-validator';

export class UserCanWriteActivityInVisitValidator implements VisitActivityBasicValidator {

    public validate(data: VisitActivityBasicValidationData): Promise<void> {
        this.verifyUserHasPermission(data.requester);
        if (this.isUserParticipantInVisit(data) || this.canUserWriteActivityInAnyVisit(data.requester)) {
            return Promise.resolve();
        }

        throw new ForbiddenException({
            message: 'User cannot write activity in visit for other participants',
            code: ApiError.USER_CANNOT_WRITE_ACTIVITY_IN_VISIT_FOR_OTHERS
        });
    }

    private verifyUserHasPermission(user: User): void | never {
        if (this.canUserWriteChild(user) || this.canUserWriteActivityInAnyVisit(user)) {
            return;
        }
        throw new ForbiddenException({
            message: 'User cannot modify visit activity',
            code: ApiError.USER_CANNOT_WRITE_ACTIVITY
        });
    }

    private isUserParticipantInVisit({visit, requester}: VisitedChildBasicValidationData): boolean {
        return visit.participants.some(p => p.id === requester.personId);
    }

    private canUserWriteChild(user: User): boolean {
        return user.permissions.includes(Permission.canWriteChild);
    }

    private canUserWriteActivityInAnyVisit(user: User): boolean {
        return user.permissions.includes(Permission.canWriteChildAtAnyVisit);
    }

}
