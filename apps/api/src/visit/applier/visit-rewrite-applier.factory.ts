import {Injectable} from '@nestjs/common';
import {VisitEntity} from '@be/visit/model/visit.entity';
import {DepartmentDao} from '@be/department/department.dao';
import {PersonDao} from '@be/person/person.dao';
import {VisitRewrite} from '@melluin/common';
import {VisitRewriteApplier} from '@be/visit/applier/visit-rewrite.applier';

@Injectable()
export class VisitRewriteApplierFactory {

    constructor(private readonly departmentDao: DepartmentDao,
                private readonly personDao: PersonDao) {
    }

    public createFor(rewrite: VisitRewrite, persisted: VisitEntity): VisitRewriteApplier {
        return new VisitRewriteApplier(this.departmentDao, this.personDao,
            rewrite, persisted);
    }

}
