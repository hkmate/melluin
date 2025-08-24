import {IsOptional, IsString, Matches, MinLength} from 'class-validator';
import {childMinBirthYear, nameMinLength} from '@shared/constants';
import {IsYearAndMonth} from '@shared/validator-decorators/is-year-and-month';

export class ChildInput {

    @IsString()
    @MinLength(nameMinLength)
    name: string;

    @IsString()
    @Matches(/\d\d\d\d\.\d\d/)
    @IsYearAndMonth(childMinBirthYear)
    guessedBirth: string;

    @IsString()
    @IsOptional()
    info?: string;

}
