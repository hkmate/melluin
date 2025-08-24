import {ChildInput} from '@shared/child/child-input';
import {ChildEntity} from '@be/child/model/child.entity';


export class ChildRewriteApplier {

    constructor(private readonly rewrite: ChildInput,
                private readonly persisted: ChildEntity) {
    }

    public applyChanges(): ChildEntity {
        this.rewirePrimitiveFields();

        return this.persisted;
    }

    private rewirePrimitiveFields(): void {
        this.persisted.name = this.rewrite.name;
        this.persisted.guessedBirth = this.rewrite.guessedBirth;
        this.persisted.info = this.rewrite.info ?? null;
    }

}
