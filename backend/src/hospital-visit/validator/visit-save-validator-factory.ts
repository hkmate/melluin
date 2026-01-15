import {Injectable} from '@nestjs/common';
import {VisitIsNotInSameTimeAsOtherValidator} from '@be/hospital-visit/validator/visit-is-not-in-same-time-as-other.validator';
import {ParticipantsIsInOneVisitAtSameTimeValidator} from '@be/hospital-visit/validator/participants-is-in-one-visit-at-same-time.validator';
import {VisitCreateValidator, VisitRewriteValidator} from '@be/hospital-visit/validator/visit-validator';
import {UserCanCreateVisitValidator} from '@be/hospital-visit/validator/user-can-create-visit.validator';
import {VicariousMomVisitHasOnlyOneParticipantValidator} from '@be/hospital-visit/validator/vicarious-mom-visit-has-only-one-participant.validator';
import {UserCanModifyVisitValidator} from '@be/hospital-visit/validator/user-can-modify-visit.validator';
import {VisitIsNotConnectedWhenOtherThenStatusChangedValidator} from '@be/hospital-visit/validator/visit-is-not-connected-when-other-then-status-changed.validator';
import {VicariousMomVisitHasNoConnectionsValidator} from '@be/hospital-visit/validator/vicarious-mom-visit-has-no-connections.validator';

@Injectable()
export class VisitSaveValidatorFactory {

    constructor(private readonly notInSameTimeAsOtherValidator: VisitIsNotInSameTimeAsOtherValidator,
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
            this.notInSameTimeAsOtherValidator
        ];
    }

    public getValidatorsForUpdate(): Array<VisitRewriteValidator> {
        return [
            new UserCanModifyVisitValidator(),
            new VisitIsNotConnectedWhenOtherThenStatusChangedValidator(),
            new VicariousMomVisitHasOnlyOneParticipantValidator(),
            new VicariousMomVisitHasNoConnectionsValidator(),
            this.notInSameTimeAsOtherValidator,
            this.participantsIsInOneVisitAtSameTimeValidator
        ];
    }

}
