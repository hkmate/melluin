import {Injectable} from '@nestjs/common';
import {Converter, DateUtil, DepartmentBoxStatusReport, isNil, UUID} from '@melluin/common';
import {randomUUID} from 'crypto';
import {DepartmentBoxStatusEntity} from '@be/department-box/model/department-box-status.entity';
import {DepartmentDao} from '@be/department/department.dao';

interface BoxStatusReportWithDepartmentId {
    departmentId: UUID;
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
            visitId: dto.report.visitId ?? null,
            department,
            dateTime: DateUtil.now(),
            reason: dto.report.reason,
            affectedObject: dto.report.affectedObject ?? null,
            comment: dto.report.comment ?? null,
        };
    }

}
