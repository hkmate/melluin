import {Injectable} from '@nestjs/common';
import {isNil} from '@shared/util/util';
import {Converter} from '@shared/converter';
import {DepartmentBoxStatusEntity} from '@be/department-box/model/department-box-status.entity';
import {DepartmentBoxStatus} from '@shared/department/box/department-box-status';

@Injectable()
export class BoxStatusEntityToDtoConverter implements Converter<DepartmentBoxStatusEntity, DepartmentBoxStatus> {

    public convert(value: DepartmentBoxStatusEntity): DepartmentBoxStatus;
    public convert(value: undefined): undefined;
    public convert(entity?: DepartmentBoxStatusEntity): DepartmentBoxStatus | undefined;
    public convert(entity?: DepartmentBoxStatusEntity): DepartmentBoxStatus | undefined {
        if (isNil(entity)) {
            return undefined;
        }
        return this.convertNotNilEntity(entity);
    }

    private convertNotNilEntity(entity: DepartmentBoxStatusEntity): DepartmentBoxStatus {
        return {
            id: entity.id,
            visitId: entity.visitId ?? undefined,
            dateTime: entity.dateTime?.toISOString(),
            reason: entity.reason,
            affectedObject: entity.affectedObject ?? undefined,
            comment: entity.comment ?? undefined
        };
    }

}
