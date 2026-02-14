import {Injectable} from '@nestjs/common';
import {HospitalVisitActivityInput} from '@shared/hospital-visit-activity/hospital-visit-activity-input';
import {ActivityRewriteApplier} from '@be/hospital-visit-activity/applier/activity-rewrite.applier';
import {VisitedChildVerifierService} from '@be/hospital-visit-children/service/visited-child-verifier.service';
import {VisitedChildrenDao} from '@be/hospital-visit-children/persistence/visited-children.dao';

@Injectable()
export class ActivityRewriteApplierFactory {

    constructor(private readonly childVerifier: VisitedChildVerifierService,
                private readonly visitedChildrenDao: VisitedChildrenDao) {
    }

    public createFor(rewrite: HospitalVisitActivityInput): ActivityRewriteApplier {
        return new ActivityRewriteApplier(this.childVerifier, this.visitedChildrenDao, rewrite);
    }

}
