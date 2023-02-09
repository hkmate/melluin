import {IsDateString, IsOptional, MinLength} from 'class-validator';
import {nameMinLength} from '@shared/constants';

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
    diseasesInfo?: string;

    @IsOptional()
    note?: string;

}
