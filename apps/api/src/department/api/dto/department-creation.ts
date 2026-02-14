import {IsBoolean, IsDateString, IsEnum, IsOptional, IsPositive, MinLength} from 'class-validator';
import {nameMinLength} from '@shared/constants';
import {OperationCity} from '@shared/person/operation-city';
import {DepartmentCreation} from '@shared/department/department-creation';

export class DepartmentCreationValidatedInput implements DepartmentCreation {

    @MinLength(nameMinLength)
    name: string;

    @IsDateString()
    validFrom: Date;

    @IsOptional()
    @IsDateString()
        // TODO Add validator to minDate
    validTo?: Date;

    @MinLength(nameMinLength)
    address: string;

    @IsEnum(OperationCity)
    city: OperationCity;

    @IsPositive()
    limitOfVisits: number;

    @IsBoolean()
    vicariousMomIncludedInLimit: boolean;

    @IsOptional()
    diseasesInfo?: string;

    @IsOptional()
    note?: string;

}
