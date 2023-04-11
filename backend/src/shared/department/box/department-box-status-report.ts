import {BoxStatusChangeReason} from '@shared/department/box/box-status-change-reason';
import {IsEnum, IsOptional, IsString, IsUUID} from 'class-validator';

export class DepartmentBoxStatusReport {

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
