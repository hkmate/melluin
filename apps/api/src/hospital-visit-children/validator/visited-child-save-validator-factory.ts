import {Injectable} from '@nestjs/common';
import {
    VisitedChildBasicValidator,
    VisitedChildUpdateValidator
} from '@be/hospital-visit-children/validator/visited-child-validator';
import {VisitIsInStartedStatusValidator} from '@be/hospital-visit-activity/validator/visit-is-in-started-status.validator';
import {AsyncValidatorChain} from '@shared/validator/validator-chain';
import {VisitIdIsSameAsInVisitedChildValidator} from '@be/hospital-visit-children/validator/visit-id-is-same-as-in-visited-child.validator';
import {NoActivityWithVisitedChildValidator} from '@be/hospital-visit-children/validator/no-activity-with-visited-child.validator';
import {UserCanWriteChildInVisitValidator} from '@be/hospital-visit-children/validator/user-can-write-child-in-visit.validator';

@Injectable()
export class VisitedChildSaveValidatorFactory {

    constructor(private readonly noActivityWithVisitedChildValidator: NoActivityWithVisitedChildValidator) {
    }

    public getValidatorForCreate(): VisitedChildBasicValidator {
        return AsyncValidatorChain.of(
            new UserCanWriteChildInVisitValidator(),
            new VisitIsInStartedStatusValidator()
        );
    }

    public getValidatorForUpdate(): VisitedChildUpdateValidator {
        return AsyncValidatorChain.of(
            new UserCanWriteChildInVisitValidator(),
            new VisitIsInStartedStatusValidator(),
            new VisitIdIsSameAsInVisitedChildValidator()
        );
    }

    public getValidatorForDelete(): VisitedChildUpdateValidator {
        return AsyncValidatorChain.of(
            new UserCanWriteChildInVisitValidator(),
            new VisitIsInStartedStatusValidator(),
            new VisitIdIsSameAsInVisitedChildValidator(),
            this.noActivityWithVisitedChildValidator
        );
    }

}
