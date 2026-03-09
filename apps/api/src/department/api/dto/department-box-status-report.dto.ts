import {BoxStatusChangeReason, DepartmentBoxStatusReport, UUID} from '@melluin/common';
import { ApiProperty } from '@nestjs/swagger';
import {IsEnum, IsOptional, IsString, IsUUID} from 'class-validator';


export class DepartmentBoxStatusReportDto implements DepartmentBoxStatusReport {

    @ApiProperty({required: false})
    @IsOptional()
    @IsUUID()
    visitId?: UUID;

    @ApiProperty({ enum: BoxStatusChangeReason, enumName: 'BoxStatusChangeReason' })
    @IsEnum(BoxStatusChangeReason)
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
