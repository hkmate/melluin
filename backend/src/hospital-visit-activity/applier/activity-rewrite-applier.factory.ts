import {Injectable} from '@nestjs/common';
import {HospitalVisitActivityInput} from '@shared/hospital-visit-activity/hospital-visit-activity-input';
import {ActivityRewriteApplier} from '@be/hospital-visit-activity/applier/activity-rewrite.applier';
import {ChildVerifierService} from '@be/child/child-verifier.service';

@Injectable()
export class ActivityRewriteApplierFactory {

    constructor(private readonly childVerifier: ChildVerifierService) {
    }

    public createFor(rewrite: HospitalVisitActivityInput): ActivityRewriteApplier {
        return new ActivityRewriteApplier(this.childVerifier, rewrite);
    }

}
