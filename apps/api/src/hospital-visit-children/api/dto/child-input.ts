import {IsOptional, IsString, Matches, MinLength} from 'class-validator';
import {ChildInput, childMinBirthYear, nameMinLength} from '@melluin/common';
import {IsYearAndMonth} from '@be/util/validator-decorators/is-year-and-month';


export class ChildValidatedInput implements ChildInput {

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
