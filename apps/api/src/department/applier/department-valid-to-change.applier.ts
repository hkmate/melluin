import {DepartmentEntity} from '@be/department/model/department.entity';
import {DepartmentUpdateChangeSet} from '@shared/department/department-update-change-set';
import {isNil, isNotNil} from '@shared/util/util';
import {BadRequestException} from '@nestjs/common';
import {Applier} from '@shared/applier';
import {DEFAULT_TO_DATE} from '@shared/api-util/default-to-date';
import {DateUtil} from '@shared/util/date-util';


export class DepartmentValidToChangeApplier implements Applier<DepartmentEntity> {

    private readonly newValidTo: Date;

    constructor(private readonly changeSet: DepartmentUpdateChangeSet) {
        this.newValidTo = isNotNil(changeSet.validTo) ? new Date(changeSet.validTo) : DEFAULT_TO_DATE;
    }

    public applyOn(entity: DepartmentEntity): void {
        this.verifyEntityValidYet(entity);
        this.verifyNewValueNotBeforeValidFrom(entity);

        entity.validTo = this.newValidTo;
    }

    private verifyEntityValidYet(entity: DepartmentEntity): void {
        if (isNil(entity.validTo)) {
            return;
        }
        if (entity.validTo < DateUtil.now()) {
            throw new BadRequestException('Department could not be changed because it is not valid anymore');
        }
    }

    private verifyNewValueNotBeforeValidFrom(entity: DepartmentEntity): void {
        if (this.newValidTo < entity.validFrom) {
            throw new BadRequestException('Department validTo could not be before validFrom');
        }
    }

}
