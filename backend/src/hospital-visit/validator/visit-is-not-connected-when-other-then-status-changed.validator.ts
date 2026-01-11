import {ForbiddenException} from '@nestjs/common';
import {AsyncValidator} from '@shared/validator/validator';
import {HospitalVisitRewriteValidationData} from '@be/hospital-visit/validator/visit-validator';
import {ApiError} from '@shared/api-util/api-error';
import {HospitalVisitEntity} from '@be/hospital-visit/model/hospital-visit.entity';
import {HospitalVisitRewrite} from '@shared/hospital-visit/hospital-visit-rewrite';
import * as _ from 'lodash';
import {isNotEmpty} from '@shared/util/util';

export class VisitIsNotConnectedWhenOtherThenStatusChangedValidator implements AsyncValidator<HospitalVisitRewriteValidationData> {

    public validate({entity, item}: HospitalVisitRewriteValidationData): Promise<void> {
        if (entity.connectionGroupId === entity.id) {
            return Promise.resolve();
        }
        this.verifyNoDepartmentChange(entity, item);
        this.verifyNoParticipantChange(entity, item);
        this.verifyNoDateTimeChange(entity, item);
        this.verifyNoCountedMinutesChange(entity, item);

        return Promise.resolve();
    }

    private verifyNoDepartmentChange(entity: HospitalVisitEntity, item: HospitalVisitRewrite): void | never {
        if (entity.department.id !== item.departmentId) {
            throw new ForbiddenException({
                message: 'Cannot modify department of a connected visit',
                code: ApiError.CANNOT_MODIFY_DEPARTMENT_OF_CONNECTED_VISIT
            });
        }
    }

    private verifyNoParticipantChange(entity: HospitalVisitEntity, item: HospitalVisitRewrite): void | never {
        const participantsId = entity.participants.map(participant => participant.id);
        const difference = _.xor(participantsId, item.participantIds);
        if (isNotEmpty(difference)) {
            throw new ForbiddenException({
                message: 'Cannot modify participants of a connected visit',
                code: ApiError.CANNOT_MODIFY_PARTICIPANTS_OF_CONNECTED_VISIT
            });
        }
    }

    private verifyNoDateTimeChange(entity: HospitalVisitEntity, item: HospitalVisitRewrite): void | never {
        const dateFromDiff = entity.dateTimeFrom.getTime() - new Date(item.dateTimeFrom).getTime();
        const dateToDiff = entity.dateTimeTo.getTime() - new Date(item.dateTimeTo).getTime();
        if (Math.abs(dateFromDiff) !== 0 || Math.abs(dateToDiff) !== 0) {
            throw new ForbiddenException({
                message: 'Cannot modify time of a connected visit',
                code: ApiError.CANNOT_MODIFY_TIME_OF_CONNECTED_VISIT
            });
        }
    }

    private verifyNoCountedMinutesChange(entity: HospitalVisitEntity, item: HospitalVisitRewrite): void | never {
        if (entity.countedMinutes !== item.countedMinutes) {
            throw new ForbiddenException({
                message: 'Cannot modify counted minutes of a connected visit',
                code: ApiError.CANNOT_MODIFY_COUNTED_MINUTES_OF_CONNECTED_VISIT
            });
        }
    }

}
