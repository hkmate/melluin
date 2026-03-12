import {BoxStatusChangeReason, BoxStatusChangeReasons, DepartmentBoxStatusReport, UUID} from '@melluin/common';
import { ApiProperty } from '@nestjs/swagger';
import {IsEnum, IsOptional, IsString, IsUUID} from 'class-validator';


export class DepartmentBoxStatusReportDto implements DepartmentBoxStatusReport {

    @ApiProperty({required: false})
    @IsOptional()
    @IsUUID()
    visitId?: UUID;

    @ApiProperty({ enum: BoxStatusChangeReasons, enumName: 'BoxStatusChangeReason' })
    @IsEnum(BoxStatusChangeReasons)
    reason: BoxStatusChangeReason;

    @ApiProperty({required: false})
    @IsOptional()
    @IsString()
    affectedObject?: string;

    @ApiProperty({required: false})
    @IsOptional()
    @IsString()
    comment?: string;

}
