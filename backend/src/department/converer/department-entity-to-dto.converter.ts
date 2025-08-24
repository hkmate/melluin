import {Injectable} from '@nestjs/common';
import {isNil} from '@shared/util/util';
import {Converter} from '@shared/converter/converter';
import {DepartmentEntity} from '@be/department/model/department.entity';
import {Department} from '@shared/department/department';
import {DEFAULT_TO_DATE} from '@shared/api-util/default-to-date';

@Injectable()
export class DepartmentEntityToDtoConverter implements Converter<DepartmentEntity, Department> {

    public convert(value: DepartmentEntity): Department;
    public convert(value: undefined): undefined;
    public convert(entity?: DepartmentEntity): Department | undefined;
    public convert(entity?: DepartmentEntity): Department | undefined {
        if (isNil(entity)) {
            return undefined;
        }
        return this.convertNotNilEntity(entity);
    }

    private convertNotNilEntity(entity: DepartmentEntity): Department {
        return {
            id: entity.id,
            name: entity.name,
            validFrom: entity.validFrom.toISOString(),
            validTo: (entity.validTo < DEFAULT_TO_DATE ? entity.validTo.toISOString() : undefined),
            address: entity.address,
            note: entity.note ?? undefined,
            diseasesInfo: entity.diseasesInfo ?? undefined,
        };
    }

}
