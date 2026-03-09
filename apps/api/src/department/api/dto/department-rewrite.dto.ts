import {IsBoolean, IsDateString, IsEnum, IsOptional, IsPositive, IsUUID, MinLength} from 'class-validator';
import {Department, nameMinLength, OperationCity, UUID} from '@melluin/common';
import {ApiProperty} from '@nestjs/swagger';

export class DepartmentRewriteDto implements Department {

    @ApiProperty()
    @IsUUID()
    id: UUID;

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
