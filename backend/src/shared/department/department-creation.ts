import {IsDateString, IsEnum, IsOptional, MinLength} from 'class-validator';
import {nameMinLength} from '@shared/constants';
import {OperationCity} from '@shared/person/operation-city';

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

    @IsEnum(OperationCity)
    city: OperationCity;

    @IsOptional()
    diseasesInfo?: string;

    @IsOptional()
    note?: string;

}
