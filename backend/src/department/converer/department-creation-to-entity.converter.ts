import {Injectable} from '@nestjs/common';
import {isNil} from '@shared/util/util';
import {Converter} from '@shared/converter';
import {randomUUID} from 'crypto';
import {DepartmentCreation} from '@shared/department/department-creation';
import {DepartmentEntity} from '@be/department/model/department.entity';
import {DEFAULT_TO_DATE} from '@shared/api-util/default-to-date';

@Injectable()
export class DepartmentCreationToEntityConverter implements Converter<DepartmentCreation, DepartmentEntity> {

    public convert(value: DepartmentCreation): DepartmentEntity;
    public convert(value: undefined): undefined;
    public convert(entity?: DepartmentCreation): DepartmentEntity | undefined;
    public convert(entity?: DepartmentCreation): DepartmentEntity | undefined {
        if (isNil(entity)) {
            return undefined;
        }
        return this.convertNotNilEntity(entity);
    }

    private convertNotNilEntity(dto: DepartmentCreation): DepartmentEntity {
        return {
            id: randomUUID(),
            name: dto.name,
            address: dto.address,
            note: dto.note ?? null,
            diseasesInfo: dto.diseasesInfo ?? null,
            validFrom: new Date(dto.validFrom),
            validTo: isNil(dto.validTo) ? DEFAULT_TO_DATE : new Date(dto.validTo)
        } satisfies DepartmentEntity;
    }

}
