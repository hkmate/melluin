import {User} from '@shared/user/user';
import {ForbiddenException} from '@nestjs/common';
import {Permission} from '@shared/user/permission.enum';
import {ApiError} from '@shared/api-util/api-error';
import {
    VisitedChildBasicValidationData,
    VisitedChildBasicValidator
} from '@be/hospital-visit-children/validator/visited-child-validator';

export class UserCanWriteChildInVisitValidator implements VisitedChildBasicValidator {

    public validate(data: VisitedChildBasicValidationData): Promise<void> {
        this.verifyUserHasPermission(data.requester);
        if (this.isUserParticipantInVisit(data) || this.canUserWriteChildInAnyVisit(data.requester)) {
            return Promise.resolve();
        }

        throw new ForbiddenException({
            message: 'User cannot write child in visit for other participants',
            code: ApiError.USER_CANNOT_WRITE_CHILD_IN_VISIT_FOR_OTHERS
        });
    }

    private verifyUserHasPermission(user: User): void | never {
        if (this.canUserWriteChild(user) || this.canUserWriteChildInAnyVisit(user)) {
            return;
        }
        throw new ForbiddenException({
            message: 'User cannot modify visit',
            code: ApiError.USER_CANNOT_WRITE_CHILD
        });
    }

    private isUserParticipantInVisit({visit, requester}: VisitedChildBasicValidationData): boolean {
        return visit.participants.some(p => p.id === requester.personId);
    }

    private canUserWriteChild(user: User): boolean {
        return user.permissions.includes(Permission.canWriteChild);
    }

    private canUserWriteChildInAnyVisit(user: User): boolean {
        return user.permissions.includes(Permission.canWriteChildAtAnyVisit);
    }

}
