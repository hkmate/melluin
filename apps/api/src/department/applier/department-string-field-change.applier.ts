import {DepartmentEntity} from '@be/department/model/department.entity';
import {Applier, DepartmentUpdateChangeSet} from '@melluin/common';


export class DepartmentStringFieldChangeApplier implements Applier<DepartmentEntity> {

    constructor(private readonly changeSet: DepartmentUpdateChangeSet,
                private readonly fieldName: string) {
    }

    public applyOn(entity: DepartmentEntity): void {
        entity[this.fieldName] = this.changeSet[this.fieldName];
    }

}
