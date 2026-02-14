import {Injectable} from '@nestjs/common';
import {VisitIsNotInSameTimeAsOtherValidator} from '@be/hospital-visit/validator/visit-is-not-in-same-time-as-other.validator';
import {ParticipantsIsInOneVisitAtSameTimeValidator} from '@be/hospital-visit/validator/participants-is-in-one-visit-at-same-time.validator';
import {VisitCreateValidator, VisitRewriteValidator} from '@be/hospital-visit/validator/visit-validator';
import {UserCanCreateVisitValidator} from '@be/hospital-visit/validator/user-can-create-visit.validator';
import {VicariousMomVisitHasOnlyOneParticipantValidator} from '@be/hospital-visit/validator/vicarious-mom-visit-has-only-one-participant.validator';
import {UserCanModifyVisitValidator} from '@be/hospital-visit/validator/user-can-modify-visit.validator';
import {VisitIsNotConnectedWhenOtherThenStatusChangedValidator} from '@be/hospital-visit/validator/visit-is-not-connected-when-other-then-status-changed.validator';
import {VicariousMomVisitHasNoConnectionsValidator} from '@be/hospital-visit/validator/vicarious-mom-visit-has-no-connections.validator';
import {VisitIsInActiveDepartmentsValidator} from '@be/hospital-visit/validator/visit-is-in-active-departments.validator';
import {ParticipantsAreWorkInCityAsDepartmentValidator} from '@be/hospital-visit/validator/participants-are-work-in-city-as-department.validator';
import {UserCanModifyStatusValidator} from '@be/hospital-visit/validator/user-can-modify-status.validator';
import {UserCanModifyDateValidator} from '@be/hospital-visit/validator/user-can-modify-date.validator';
import {UserCanModifyDepartmentValidator} from '@be/hospital-visit/validator/user-can-modify-department.validator';
import {UserCanModifyParticipantsValidator} from '@be/hospital-visit/validator/user-can-modify-participants.validator';
import {UserCanModifyVicariousMomFlagValidator} from '@be/hospital-visit/validator/user-can-modify-vicarious-mom-flag.validator';

@Injectable()
export class VisitSaveValidatorFactory {

    constructor(private readonly notInSameTimeAsOtherValidator: VisitIsNotInSameTimeAsOtherValidator,
                private readonly visitIsInActiveDepartmentsValidator: VisitIsInActiveDepartmentsValidator,
                private readonly participantsAreWorkInCityAsDepartmentValidator: ParticipantsAreWorkInCityAsDepartmentValidator,
                private readonly participantsIsInOneVisitAtSameTimeValidator: ParticipantsIsInOneVisitAtSameTimeValidator) {
    }

    public getValidatorsForCreate(): Array<VisitCreateValidator> {
        return [
            ...this.getValidatorsForContinue(),
            this.participantsIsInOneVisitAtSameTimeValidator
        ];
    }

    public getValidatorsForContinue(): Array<VisitCreateValidator> {
        return [
            new UserCanCreateVisitValidator(),
            new VicariousMomVisitHasOnlyOneParticipantValidator(),
            this.participantsAreWorkInCityAsDepartmentValidator,
            this.visitIsInActiveDepartmentsValidator,
            this.notInSameTimeAsOtherValidator
        ];
    }

    // eslint-disable-next-line max-lines-per-function
    public getValidatorsForUpdate(): Array<VisitRewriteValidator> {
        return [
            new UserCanModifyVisitValidator(),
            new UserCanModifyStatusValidator(),
            new UserCanModifyDateValidator(),
            new UserCanModifyDepartmentValidator(),
            new UserCanModifyParticipantsValidator(),
            new UserCanModifyVicariousMomFlagValidator(),
            new VisitIsNotConnectedWhenOtherThenStatusChangedValidator(),
            new VicariousMomVisitHasOnlyOneParticipantValidator(),
            new VicariousMomVisitHasNoConnectionsValidator(),
            this.participantsAreWorkInCityAsDepartmentValidator,
            this.visitIsInActiveDepartmentsValidator,
            this.notInSameTimeAsOtherValidator,
            this.participantsIsInOneVisitAtSameTimeValidator
        ];
    }

}
