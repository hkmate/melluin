import {ForbiddenException} from '@nestjs/common';
import {VisitRewriteValidationData, VisitRewriteValidator} from '@be/visit/validator/visit-validator';
import {ApiErrors, VisitRewrite, isNotEmpty} from '@melluin/common';
import {VisitEntity} from '@be/visit/model/visit.entity';
import * as _ from 'lodash';

export class VisitIsNotConnectedWhenOtherThenStatusChangedValidator implements VisitRewriteValidator {

    public validate({entity, item}: VisitRewriteValidationData): Promise<void> {
        if (entity.connectionGroupId === entity.id) {
            return Promise.resolve();
        }
        this.verifyNoDepartmentChange(entity, item);
        this.verifyNoParticipantChange(entity, item);
        this.verifyNoDateTimeChange(entity, item);
        this.verifyNoCountedMinutesChange(entity, item);

        return Promise.resolve();
    }

    private verifyNoDepartmentChange(entity: VisitEntity, item: VisitRewrite): void | never {
        if (entity.department.id !== item.departmentId) {
            throw new ForbiddenException({
                message: 'Cannot modify department of a connected visit',
                code: ApiErrors.CANNOT_MODIFY_DEPARTMENT_OF_CONNECTED_VISIT
            });
        }
    }

    private verifyNoParticipantChange(entity: VisitEntity, item: VisitRewrite): void | never {
        const participantsId = entity.participants.map(participant => participant.id);
        const difference = _.xor(participantsId, item.participantIds);
        if (isNotEmpty(difference)) {
            throw new ForbiddenException({
                message: 'Cannot modify participants of a connected visit',
                code: ApiErrors.CANNOT_MODIFY_PARTICIPANTS_OF_CONNECTED_VISIT
            });
        }
    }

    private verifyNoDateTimeChange(entity: VisitEntity, item: VisitRewrite): void | never {
        const dateFromDiff = entity.dateTimeFrom.getTime() - new Date(item.dateTimeFrom).getTime();
        const dateToDiff = entity.dateTimeTo.getTime() - new Date(item.dateTimeTo).getTime();
        if (Math.abs(dateFromDiff) !== 0 || Math.abs(dateToDiff) !== 0) {
            throw new ForbiddenException({
                message: 'Cannot modify time of a connected visit',
                code: ApiErrors.CANNOT_MODIFY_TIME_OF_CONNECTED_VISIT
            });
        }
    }

    private verifyNoCountedMinutesChange(entity: VisitEntity, item: VisitRewrite): void | never {
        if (entity.countedMinutes !== item.countedMinutes) {
            throw new ForbiddenException({
                message: 'Cannot modify counted minutes of a connected visit',
                code: ApiErrors.CANNOT_MODIFY_COUNTED_MINUTES_OF_CONNECTED_VISIT
            });
        }
    }

}
