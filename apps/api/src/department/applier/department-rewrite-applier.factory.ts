import {Injectable} from '@nestjs/common';
import {Department} from '@melluin/common';
import {DepartmentEntity} from '@be/department/model/department.entity';
import {DepartmentRewriteApplier} from '@be/department/applier/department-rewrite.applier';

@Injectable()
export class DepartmentRewriteApplierFactory {

    public createFor(rewrite: Department, persisted: DepartmentEntity): DepartmentRewriteApplier {
        return new DepartmentRewriteApplier(rewrite, persisted);
    }

}
