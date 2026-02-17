import {Injectable} from '@nestjs/common';
import {VisitActivityInput} from '@melluin/common';
import {ActivityRewriteApplier} from '@be/visit-activity/applier/activity-rewrite.applier';
import {VisitedChildVerifierService} from '@be/visit-children/service/visited-child-verifier.service';
import {VisitedChildrenDao} from '@be/visit-children/persistence/visited-children.dao';

@Injectable()
export class ActivityRewriteApplierFactory {

    constructor(private readonly childVerifier: VisitedChildVerifierService,
                private readonly visitedChildrenDao: VisitedChildrenDao) {
    }

    public createFor(rewrite: VisitActivityInput): ActivityRewriteApplier {
        return new ActivityRewriteApplier(this.childVerifier, this.visitedChildrenDao, rewrite);
    }

}
