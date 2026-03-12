import {ApiErrors, VisitRewrite, isEmpty, Permission, User, VisitStatuses} from '@melluin/common';
import {ForbiddenException} from '@nestjs/common';
import {VisitRewriteValidationData, VisitRewriteValidator} from '@be/visit/validator/visit-validator';
import {VisitEntity} from '@be/visit/model/visit.entity';
import * as _ from 'lodash';

export class UserCanModifyParticipantsValidator implements VisitRewriteValidator {

    public validate(data: VisitRewriteValidationData): Promise<void> {
        if (this.isNoParticipantChange(data.entity, data.item)) {
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

    private verifyVolunteerChangeIsValid({item, entity}: VisitRewriteValidationData): void | never {
        const isScheduled = entity.status === VisitStatuses.SCHEDULED
            || item.status === VisitStatuses.SCHEDULED;

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

    private isNoParticipantChange(entity: VisitEntity, item: VisitRewrite): boolean {
        const entityParticipantIds = entity.participants.map(p => p.id);
        return isEmpty(_.xor(entityParticipantIds, item.participantIds));
    }

    private throwError(): never {
        throw new ForbiddenException({
            message: 'User cannot perform this participant change',
            code: ApiErrors.VISIT_PARTICIPANT_CHANGE_DISABLED
        });
    }

}
