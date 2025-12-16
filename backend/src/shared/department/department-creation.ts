import {IsDateString, IsEnum, IsOptional, MinLength} from 'class-validator';
import {nameMinLength} from '@shared/constants';
import {DepartmentCity} from '@shared/department/department-city';

export class DepartmentCreation {

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

    @IsEnum(DepartmentCity)
    city: DepartmentCity;

    @IsOptional()
    diseasesInfo?: string;

    @IsOptional()
    note?: string;

}
