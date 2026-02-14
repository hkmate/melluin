import {Injectable} from '@nestjs/common';
import {ChildRewriteApplier} from '@be/child/converer/child-rewrite.applier';
import {ChildInput} from '@shared/child/child-input';
import {ChildEntity} from '@be/child/model/child.entity';

@Injectable()
export class ChildRewriteApplierFactory {

    public createFor(rewrite: ChildInput, persisted: ChildEntity): ChildRewriteApplier {
        return new ChildRewriteApplier(rewrite, persisted);
    }

}
