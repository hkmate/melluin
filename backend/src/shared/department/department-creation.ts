import {IsDateString, IsOptional, MinLength} from 'class-validator';
import {nameMinLength} from '@shared/constants';

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

    @IsOptional()
    diseasesInfo?: string;

    @IsOptional()
    note?: string;

}
