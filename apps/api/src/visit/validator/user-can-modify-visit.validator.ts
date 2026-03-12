import {ApiErrors, Permission, User} from '@melluin/common';
import {ForbiddenException} from '@nestjs/common';
import {VisitRewriteValidationData, VisitRewriteValidator} from '@be/visit/validator/visit-validator';

export class UserCanModifyVisitValidator implements VisitRewriteValidator {

    public validate(data: VisitRewriteValidationData): Promise<void> {
        this.verifyUserHasPermission(data.requester);
        if (this.isUserParticipantInVisit(data) || this.canUserModifyAnyVisit(data.requester)) {
            return Promise.resolve();
        }

        throw new ForbiddenException({
            message: 'User cannot modify visit for other participants',
            code: ApiErrors.USER_CANNOT_MODIFY_VISIT_FOR_OTHERS
        });
    }

    private verifyUserHasPermission(user: User): void | never {
        if (this.canUserModifyVisit(user) || this.canUserModifyAnyVisit(user)) {
            return;
        }
        throw new ForbiddenException({
            message: 'User cannot modify visit',
            code: ApiErrors.USER_CANNOT_MODIFY_VISIT
        });
    }

    private isUserParticipantInVisit({entity, requester}: VisitRewriteValidationData): boolean {
        return entity.participants.some(p => p.id === requester.personId);
    }

    private canUserModifyVisit(user: User): boolean {
        return user.permissions.includes(Permission.canModifyVisit);
    }

    private canUserModifyAnyVisit(user: User): boolean {
        return user.permissions.includes(Permission.canModifyAnyVisit)
            || user.permissions.includes(Permission.canModifyAnyVisitUnrestricted);
    }

}
