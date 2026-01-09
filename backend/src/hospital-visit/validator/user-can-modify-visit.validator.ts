import {User} from '@shared/user/user';
import {ForbiddenException} from '@nestjs/common';
import {Permission} from '@shared/user/permission.enum';
import {AsyncValidator} from '@shared/validator/validator';
import {HospitalVisitRewriteValidationData} from '@be/hospital-visit/validator/visit-validator';
import {ApiError} from '@shared/api-util/api-error';

export class UserCanModifyVisitValidator implements AsyncValidator<HospitalVisitRewriteValidationData> {

    public validate(data: HospitalVisitRewriteValidationData): Promise<void> {
        this.verifyUserHasPermission(data.requester);
        if (this.isUserParticipantInVisit(data) || this.canUserModifyAnyVisit(data.requester)) {
            return Promise.resolve();
        }

        throw new ForbiddenException({
            message: 'User cannot modify visit for other participants',
            code: ApiError.USER_CANNOT_MODIFY_VISIT_FOR_OTHERS
        });
    }

    private verifyUserHasPermission(user: User): void | never {
        if (this.canUserModifyVisit(user) || this.canUserModifyAnyVisit(user)) {
            return;
        }
        throw new ForbiddenException({
            message: 'User cannot modify visit',
            code: ApiError.USER_CANNOT_MODIFY_VISIT
        });
    }

    private isUserParticipantInVisit({entity, requester}: HospitalVisitRewriteValidationData): boolean {
        return entity.participants.some(p => p.id === requester.personId);
    }

    private canUserModifyVisit(user: User): boolean {
        return user.permissions.includes(Permission.canModifyVisit);
    }

    private canUserModifyAnyVisit(user: User): boolean {
        return user.permissions.includes(Permission.canModifyAnyVisit);
    }

}
