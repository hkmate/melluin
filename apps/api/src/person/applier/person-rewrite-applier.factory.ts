import {Injectable} from '@nestjs/common';
import {PersonRewrite} from '@melluin/common';
import {PersonEntity} from '@be/person/model/person.entity';
import {PersonRewriteApplier} from '@be/person/applier/person-rewrite.applier';

@Injectable()
export class PersonRewriteApplierFactory {

    public createFor(rewrite: PersonRewrite, persisted: PersonEntity): PersonRewriteApplier {
        return new PersonRewriteApplier(rewrite, persisted);
    }

}
