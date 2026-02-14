import {Injectable} from '@nestjs/common';
import {HospitalVisitEntity} from '@be/hospital-visit/model/hospital-visit.entity';
import {DepartmentDao} from '@be/department/department.dao';
import {PersonDao} from '@be/person/person.dao';
import {HospitalVisitRewrite} from '@shared/hospital-visit/hospital-visit-rewrite';
import {HospitalVisitRewriteApplier} from '@be/hospital-visit/applier/hospital-visit-rewrite.applier';

@Injectable()
export class HospitalVisitRewriteApplierFactory {

    constructor(private readonly departmentDao: DepartmentDao,
                private readonly personDao: PersonDao) {
    }

    public createFor(rewrite: HospitalVisitRewrite, persisted: HospitalVisitEntity): HospitalVisitRewriteApplier {
        return new HospitalVisitRewriteApplier(this.departmentDao, this.personDao,
            rewrite, persisted);
    }

}
