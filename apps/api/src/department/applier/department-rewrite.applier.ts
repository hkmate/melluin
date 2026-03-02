import {DEFAULT_TO_DATE, Department, emptyToUndef, isNil} from '@melluin/common';
import {DepartmentEntity} from '@be/department/model/department.entity';
import dayjs from 'dayjs';


export class DepartmentRewriteApplier {

    constructor(private readonly rewrite: Department,
                private readonly persisted: DepartmentEntity) {
    }

    public applyChanges(): DepartmentEntity {
        this.rewirePrimitiveFields();
        return this.persisted;
    }

    private rewirePrimitiveFields(): void {
        this.persisted.name = this.rewrite.name;
        this.persisted.validFrom = dayjs(this.rewrite.validFrom).toDate();
        this.persisted.validTo = isNil(this.rewrite.validTo) ? DEFAULT_TO_DATE : dayjs(this.rewrite.validTo).toDate();
        this.persisted.address = this.rewrite.address;
        this.persisted.city = this.rewrite.city;
        this.persisted.limitOfVisits = this.rewrite.limitOfVisits;
        this.persisted.vicariousMomIncludedInLimit = this.rewrite.vicariousMomIncludedInLimit;
        this.persisted.diseasesInfo = emptyToUndef(this.rewrite.diseasesInfo) ?? null;
        this.persisted.note = emptyToUndef(this.rewrite.note) ?? null;
    }

}
