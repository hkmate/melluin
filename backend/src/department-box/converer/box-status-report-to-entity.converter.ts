import {Injectable} from '@nestjs/common';
import {isNil} from '@shared/util/util';
import {Converter} from '@shared/converter';
import {randomUUID} from 'crypto';
import {DepartmentBoxStatusReport} from '@shared/department/box/department-box-status-report';
import {DepartmentBoxStatusEntity} from '@be/department-box/model/department-box-status.entity';
import {DepartmentDao} from '@be/department/department.dao';
import {DateUtil} from '@shared/util/date-util';

interface BoxStatusReportWithDepartmentId {
    departmentId: string;
    report: DepartmentBoxStatusReport;
}

@Injectable()
export class BoxStatusReportToEntityConverter
    implements Converter<BoxStatusReportWithDepartmentId, Promise<DepartmentBoxStatusEntity>> {

    constructor(private readonly departmentDao: DepartmentDao) {
    }

    public convert(value: BoxStatusReportWithDepartmentId): Promise<DepartmentBoxStatusEntity>;
    public convert(value: undefined): undefined;
    public convert(entity?: BoxStatusReportWithDepartmentId): Promise<DepartmentBoxStatusEntity> | undefined;
    public convert(entity?: BoxStatusReportWithDepartmentId): Promise<DepartmentBoxStatusEntity> | undefined {
        if (isNil(entity)) {
            return undefined;
        }
        return this.convertNotNilEntity(entity);
    }

    private async convertNotNilEntity(dto: BoxStatusReportWithDepartmentId): Promise<DepartmentBoxStatusEntity> {
        const department = await this.departmentDao.getOne(dto.departmentId);
        return {
            id: randomUUID(),
            visitId: dto.report.visitId,
            department,
            dateTime: DateUtil.now(),
            reason: dto.report.reason,
            affectedObject: dto.report.affectedObject,
            comment: dto.report.comment,
        } as DepartmentBoxStatusEntity;
    }

}
