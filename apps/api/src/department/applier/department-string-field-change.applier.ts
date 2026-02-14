import {DepartmentEntity} from '@be/department/model/department.entity';
import {DepartmentUpdateChangeSet} from '@shared/department/department-update-change-set';
import {Applier} from '@shared/applier';


export class DepartmentStringFieldChangeApplier implements Applier<DepartmentEntity> {

    constructor(private readonly changeSet: DepartmentUpdateChangeSet,
                private readonly fieldName: string) {
    }

    public applyOn(entity: DepartmentEntity): void {
        entity[this.fieldName] = this.changeSet[this.fieldName];
    }

}
