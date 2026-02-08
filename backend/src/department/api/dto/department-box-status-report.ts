import {BoxStatusChangeReason} from '@shared/department/box/box-status-change-reason';
import {IsEnum, IsOptional, IsString, IsUUID} from 'class-validator';
import {DepartmentBoxStatusReport} from '@shared/department/box/department-box-status-report';


export class DepartmentBoxStatusReportValidatedInput implements DepartmentBoxStatusReport {

    @IsOptional()
    @IsUUID()
    visitId?: string;

    @IsEnum(BoxStatusChangeReason)
    reason: BoxStatusChangeReason;

    @IsOptional()
    @IsString()
    affectedObject?: string;

    @IsOptional()
    @IsString()
    comment?: string;

}
