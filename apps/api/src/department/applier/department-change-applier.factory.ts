import {Injectable} from '@nestjs/common';
import {DepartmentUpdateChangeSet} from '@shared/department/department-update-change-set';
import {DepartmentEntity} from '@be/department/model/department.entity';
import {DepartmentValidToChangeApplier} from '@be/department/applier/department-valid-to-change.applier';
import {Applier, ApplierChain} from '@shared/applier';
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
