import {BoxStatusChangeReason} from '@shared/department/box/box-status-change-reason';
import {IsEnum, IsOptional, IsString} from 'class-validator';

export class DepartmentBoxStatusReport {

    @IsEnum(BoxStatusChangeReason)
    reason: BoxStatusChangeReason;

    @IsOptional()
    @IsString()
    affectedObject?: string;

    @IsOptional()
    @IsString()
    comment?: string;

}
