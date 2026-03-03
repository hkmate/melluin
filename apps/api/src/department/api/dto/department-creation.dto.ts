import {IsBoolean, IsDateString, IsEnum, IsOptional, IsPositive, MinLength} from 'class-validator';
import {DepartmentCreation, nameMinLength, OperationCity} from '@melluin/common';
import { ApiProperty } from '@nestjs/swagger';

export class DepartmentCreationDto implements DepartmentCreation {

    @ApiProperty()
    @MinLength(nameMinLength)
    name: string;

    @ApiProperty()
    @IsDateString()
    validFrom: string;

    @ApiProperty({required: false})
    @IsOptional()
    @IsDateString()
    validTo?: string;

    @ApiProperty()
    @MinLength(nameMinLength)
    address: string;

    @ApiProperty({ enum: OperationCity, enumName: 'OperationCity' })
    @IsEnum(OperationCity)
    city: OperationCity;

    @ApiProperty()
    @IsPositive()
    limitOfVisits: number;

    @ApiProperty()
    @IsBoolean()
    vicariousMomIncludedInLimit: boolean;

    @ApiProperty({required: false})
    @IsOptional()
    diseasesInfo?: string;

    @ApiProperty({required: false})
    @IsOptional()
    note?: string;

}
