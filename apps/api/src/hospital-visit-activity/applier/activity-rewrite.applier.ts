import {AsyncApplier, HospitalVisitActivityInput} from '@melluin/common';
import {HospitalVisitActivityEntity} from '@be/hospital-visit-activity/model/hospital-visit-activity.entity';
import {VisitedChildVerifierService} from '@be/hospital-visit-children/service/visited-child-verifier.service';
import {VisitedChildrenDao} from '@be/hospital-visit-children/persistence/visited-children.dao';


export class ActivityRewriteApplier implements AsyncApplier<HospitalVisitActivityEntity> {

    constructor(private readonly childVerifyService: VisitedChildVerifierService,
                private readonly visitedChildDao: VisitedChildrenDao,
                private readonly rewrite: HospitalVisitActivityInput) {
    }

    public async applyOn(persisted: HospitalVisitActivityEntity): Promise<void> {
        await this.childVerifyService.verifyEveryChildIdExists(this.rewrite.children);
        await this.rewirePrimitiveFields(persisted);
    }

    private async rewirePrimitiveFields(persisted: HospitalVisitActivityEntity): Promise<void> {
        const visitedChildren = await this.visitedChildDao.findAllByIds(this.rewrite.children);
        persisted.activities = this.rewrite.activities;
        persisted.children = visitedChildren;
        persisted.comment = this.rewrite.comment;
    }

}
