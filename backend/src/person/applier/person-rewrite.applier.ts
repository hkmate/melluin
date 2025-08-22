import { PersonEntity } from '@be/person/model/person.entity';
import { PersonRewrite } from '@shared/person/person-rewrite';


export class PersonRewriteApplier {

    constructor(private readonly rewrite: PersonRewrite,
                private readonly persisted: PersonEntity) {
    }

    public applyChanges(): PersonEntity {
        this.rewirePrimitiveFields();
        return this.persisted;
    }

    private rewirePrimitiveFields(): void {
        this.persisted.firstName = this.rewrite.firstName;
        this.persisted.lastName = this.rewrite.lastName;
        this.persisted.phone = this.rewrite.phone ?? null;
        this.persisted.email = this.rewrite.email ?? null;
        this.persisted.preferences = this.rewrite.preferences ?? null;
    }

}
