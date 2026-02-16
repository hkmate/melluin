import {IsBoolean, IsDateString, IsEnum, IsOptional, IsPositive, MinLength} from 'class-validator';
import {DepartmentUpdateChangeSet, nameMinLength, OperationCity} from '@melluin/common';
import {ApiProperty} from '@nestjs/swagger';

export class DepartmentUpdateChangeSetDto implements DepartmentUpdateChangeSet {

    @ApiProperty({required: false})
    @IsOptional()
    @MinLength(nameMinLength)
    name?: string;

    @ApiProperty({required: false})
    @IsOptional()
    @IsDateString()
    validTo?: string;

    @ApiProperty({required: false})
    @IsOptional()
    @MinLength(nameMinLength)
    address?: string;

    @ApiProperty({enum: OperationCity, enumName: 'OperationCity', required: false})
    @IsOptional()
    @IsEnum(OperationCity)
    city?: OperationCity;

    @ApiProperty({required: false})
    @IsPositive()
    @IsOptional()
    limitOfVisits?: number;

    @ApiProperty({required: false})
    @IsBoolean()
    @IsOptional()
    vicariousMomIncludedInLimit?: boolean;

    @ApiProperty({required: false})
    @IsOptional()
    diseasesInfo?: string;

    @ApiProperty({required: false})
    @IsOptional()
    note?: string;

}
