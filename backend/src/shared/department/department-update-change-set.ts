import {IsDateString, IsEnum, IsOptional, MinLength} from 'class-validator';
import {nameMinLength} from '@shared/constants';
import {OperationCity} from '@shared/person/operation-city';

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
    @IsEnum(OperationCity)
    city: OperationCity;

    @IsOptional()
    diseasesInfo?: string;

    @IsOptional()
    note?: string;

}
