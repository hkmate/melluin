import {IsDateString, IsEnum, IsOptional, MinLength} from 'class-validator';
import {nameMinLength} from '@shared/constants';
import {DepartmentCity} from '@shared/department/department-city';

export class DepartmentUpdateChangeSet {

    @IsOptional()
    @MinLength(nameMinLength)
    name?: string;

    @IsOptional()
    @IsDateString()
    validTo?: string;

    @IsOptional()
    @MinLength(nameMinLength)
    address?: string;

    @IsOptional()
    @IsEnum(DepartmentCity)
    city: DepartmentCity;

    @IsOptional()
    diseasesInfo?: string;

    @IsOptional()
    note?: string;

}
