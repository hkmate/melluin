import {Injectable} from '@nestjs/common';
import {isNil} from '@shared/util/util';
import {Converter} from '@shared/converter';
import {DepartmentBoxStatusEntity} from '@be/department-box/model/department-box-status.entity';
import {BoxStatusWithDepartmentBrief} from '@shared/department/box/department-box-status';
import {BoxStatusEntityToDtoConverter} from '@be/department-box/converer/box-status-entity-to-dto.converter';

@Injectable()
export class BoxStatusEntityToDtoWithDepartmentBriefConverter implements Converter<DepartmentBoxStatusEntity, BoxStatusWithDepartmentBrief> {

    constructor(private readonly pureConverter: BoxStatusEntityToDtoConverter) {
    }

    public convert(value: DepartmentBoxStatusEntity): BoxStatusWithDepartmentBrief;
    public convert(value: undefined): undefined;
    public convert(entity?: DepartmentBoxStatusEntity): BoxStatusWithDepartmentBrief | undefined;
    public convert(entity?: DepartmentBoxStatusEntity): BoxStatusWithDepartmentBrief | undefined {
        if (isNil(entity)) {
            return undefined;
        }
        return this.convertNotNilEntity(entity);
    }

    private convertNotNilEntity(entity: DepartmentBoxStatusEntity): BoxStatusWithDepartmentBrief {
        return {
            ...this.pureConverter.convert(entity),
            departmentId: entity.department.id,
            departmentName: entity.department.name
        };
    }

}
