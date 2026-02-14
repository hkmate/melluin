import {Injectable} from '@nestjs/common';
import {VisitActivityBasicValidator, VisitActivityUpdateValidator} from './visit-activity-validator';
import {AsyncValidatorChain} from '@shared/validator/validator-chain';
import {UserCanWriteActivityInVisitValidator} from '@be/hospital-visit-activity/validator/user-can-write-activity-in-visit.validator';
import {VisitIsInStartedStatusValidator} from '@be/hospital-visit-activity/validator/visit-is-in-started-status.validator';
import {VisitIdIsSameAsInActivityValidator} from '@be/hospital-visit-activity/validator/visit-id-is-same-as-in-activity.validator';


@Injectable()
export class VisitActivitySaveValidatorFactory {

    public getValidatorForCreate(): VisitActivityBasicValidator {
        return AsyncValidatorChain.of(
            new UserCanWriteActivityInVisitValidator(),
            new VisitIsInStartedStatusValidator()
        );
    }

    public getValidatorForUpdate(): VisitActivityUpdateValidator {
        return AsyncValidatorChain.of(
            new UserCanWriteActivityInVisitValidator(),
            new VisitIsInStartedStatusValidator(),
            new VisitIdIsSameAsInActivityValidator()
        );
    }

    public getValidatorForDelete(): VisitActivityUpdateValidator {
        return AsyncValidatorChain.of(
            new UserCanWriteActivityInVisitValidator(),
            new VisitIsInStartedStatusValidator(),
            new VisitIdIsSameAsInActivityValidator()
        );
    }

}
