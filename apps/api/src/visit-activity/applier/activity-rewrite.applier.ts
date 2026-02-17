import {AsyncApplier, VisitActivityInput} from '@melluin/common';
import {VisitActivityEntity} from '@be/visit-activity/model/visit-activity.entity';
import {VisitedChildVerifierService} from '@be/visit-children/service/visited-child-verifier.service';
import {VisitedChildrenDao} from '@be/visit-children/persistence/visited-children.dao';


export class ActivityRewriteApplier implements AsyncApplier<VisitActivityEntity> {

    constructor(private readonly childVerifyService: VisitedChildVerifierService,
                private readonly visitedChildDao: VisitedChildrenDao,
                private readonly rewrite: VisitActivityInput) {
    }

    public async applyOn(persisted: VisitActivityEntity): Promise<void> {
        await this.childVerifyService.verifyEveryChildIdExists(this.rewrite.children);
        await this.rewirePrimitiveFields(persisted);
    }

    private async rewirePrimitiveFields(persisted: VisitActivityEntity): Promise<void> {
        const visitedChildren = await this.visitedChildDao.findAllByIds(this.rewrite.children);
        persisted.activities = this.rewrite.activities;
        persisted.children = visitedChildren;
        persisted.comment = this.rewrite.comment;
    }

}
