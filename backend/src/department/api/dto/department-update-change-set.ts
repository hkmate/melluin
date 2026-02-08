import {IsBoolean, IsDateString, IsEnum, IsOptional, IsPositive, MinLength} from 'class-validator';
import {nameMinLength} from '@shared/constants';
import {OperationCity} from '@shared/person/operation-city';
import {DepartmentUpdateChangeSet} from '@shared/department/department-update-change-set';

export class DepartmentUpdateChangeSetValidatedInput implements DepartmentUpdateChangeSet {

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
    city?: OperationCity;

    @IsPositive()
    @IsOptional()
    limitOfVisits?: number;

    @IsBoolean()
    @IsOptional()
    vicariousMomIncludedInLimit?: boolean;

    @IsOptional()
    diseasesInfo?: string;

    @IsOptional()
    note?: string;

}
