import {Injectable} from '@nestjs/common';
import {Applier, ApplierChain, DepartmentUpdateChangeSet} from '@melluin/common';
import {DepartmentEntity} from '@be/department/model/department.entity';
import {DepartmentValidToChangeApplier} from '@be/department/applier/department-valid-to-change.applier';
import {DepartmentStringFieldChangeApplier} from '@be/department/applier/department-string-field-change.applier';

@Injectable()
export class DepartmentChangeApplierFactory {

    public createApplierFor(changeSet: DepartmentUpdateChangeSet): Applier<DepartmentEntity> {
        const appliers: Array<Applier<DepartmentEntity>> = Object.keys(changeSet).map(fieldName => {
            if (fieldName === 'validTo') {
                return new DepartmentValidToChangeApplier(changeSet);
            }
            return new DepartmentStringFieldChangeApplier(changeSet, fieldName);
        });

        return ApplierChain.of(...appliers);
    }

}
