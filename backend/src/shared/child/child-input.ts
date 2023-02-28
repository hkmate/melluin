import {IsNumber, IsOptional, IsString, Min, MinLength} from 'class-validator';
import {childMinBirthYear, nameMinLength} from '@shared/constants';

export class ChildInput {

    @IsString()
    @MinLength(nameMinLength)
    name: string;

    @IsNumber()
    @Min(childMinBirthYear)
    birthYear: number;

    @IsString()
    @IsOptional()
    info: string;

}
