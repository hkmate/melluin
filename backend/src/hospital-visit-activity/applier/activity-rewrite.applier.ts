import {HospitalVisitActivityInput} from '@shared/hospital-visit-activity/hospital-visit-activity-input';
import {HospitalVisitActivityEntity} from '@be/hospital-visit-activity/model/hospital-visit-activity.entity';
import {ChildVerifierService} from '@be/child/child-verifier.service';
import {AsyncApplier} from '@shared/applier';


export class ActivityRewriteApplier implements AsyncApplier<HospitalVisitActivityEntity> {

    constructor(private readonly childVerifyService: ChildVerifierService,
                private readonly rewrite: HospitalVisitActivityInput) {
    }

    public async applyOn(persisted: HospitalVisitActivityEntity): Promise<void> {
        const childIds = this.rewrite.children.map(childInfo => childInfo.childId);
        await this.childVerifyService.verifyEveryChildIdExists(childIds);
        this.rewirePrimitiveFields(persisted);
    }

    private rewirePrimitiveFields(persisted: HospitalVisitActivityEntity): void {
        persisted.activities = this.rewrite.activities;
        persisted.children = this.rewrite.children;
        persisted.comment = this.rewrite.comment;
    }

}
