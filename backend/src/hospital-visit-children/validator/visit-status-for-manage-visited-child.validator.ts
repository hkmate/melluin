import {ForbiddenException} from '@nestjs/common';
import {Validator} from '@shared/validator/validator';
import {HospitalVisitEntity} from '@be/hospital-visit/model/hospital-visit.entity';
import {HospitalVisitStatus} from '@shared/hospital-visit/hospital-visit-status';

export class VisitStatusForManageVisitedChildValidator implements Validator<HospitalVisitEntity> {

    private static readonly STATUSES_WHEN_MANAGING_CHILD_ID_ALLOWED = [
        HospitalVisitStatus.STARTED,
        HospitalVisitStatus.ACTIVITIES_FILLED_OUT,
        HospitalVisitStatus.ALL_FILLED_OUT
    ]

    public static of(): VisitStatusForManageVisitedChildValidator {
        return new VisitStatusForManageVisitedChildValidator();
    }

    public validate(hospitalVisitEntity: HospitalVisitEntity): void {
        if (this.isVisitStatusAllowToManageChild(hospitalVisitEntity)) {
            return;
        }
        throw new ForbiddenException(
            `You can not manage children in this status of visit (${hospitalVisitEntity.status})`);
    }

    private isVisitStatusAllowToManageChild(hospitalVisitEntity: HospitalVisitEntity): boolean {
        return VisitStatusForManageVisitedChildValidator.STATUSES_WHEN_MANAGING_CHILD_ID_ALLOWED
            .includes(hospitalVisitEntity.status);
    }

}
