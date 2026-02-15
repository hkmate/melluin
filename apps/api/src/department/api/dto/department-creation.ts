import {IsBoolean, IsDateString, IsEnum, IsOptional, IsPositive, MinLength} from 'class-validator';
import {DepartmentCreation, nameMinLength, OperationCity} from '@melluin/common';

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
