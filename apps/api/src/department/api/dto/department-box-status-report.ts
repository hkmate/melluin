import {BoxStatusChangeReason, DepartmentBoxStatusReport} from '@melluin/common';
import {IsEnum, IsOptional, IsString, IsUUID} from 'class-validator';


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
