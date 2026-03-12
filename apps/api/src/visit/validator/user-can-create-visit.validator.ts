import {ApiErrors, VisitCreate, Permission, User} from '@melluin/common';
import {ForbiddenException} from '@nestjs/common';
import {VisitCreateValidationData, VisitCreateValidator} from '@be/visit/validator/visit-validator';

export class UserCanCreateVisitValidator implements VisitCreateValidator {

    public validate({requester, item}: VisitCreateValidationData): Promise<void> {
        this.verifyUserHasPermission(requester);
        if (this.isUserParticipantInVisit(requester, item) || this.canUserCreateAnyVisit(requester)) {
            return Promise.resolve();
        }

        throw new ForbiddenException({
            message: 'User cannot create visit for other participants',
            code: ApiErrors.USER_CANNOT_CREATE_VISIT_FOR_OTHERS
        });
    }

    private verifyUserHasPermission(user: User): void | never {
        if (this.canUserCreateVisit(user) || this.canUserCreateAnyVisit(user)) {
            return;
        }
        throw new ForbiddenException({
            message: 'User cannot create visit',
            code: ApiErrors.USER_CANNOT_CREATE_VISIT
        });
    }

    private isUserParticipantInVisit(user: User, visit: VisitCreate): boolean {
        return visit.participantIds.some(participantId => participantId === user.personId);
    }

    private canUserCreateVisit(user: User): boolean {
        return user.permissions.includes(Permission.canCreateVisit);
    }

    private canUserCreateAnyVisit(user: User): boolean {
        return user.permissions.includes(Permission.canCreateAnyVisit);
    }

}
