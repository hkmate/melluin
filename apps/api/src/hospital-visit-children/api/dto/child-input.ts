import {IsOptional, IsString, Matches, MinLength} from 'class-validator';
import {childMinBirthYear, nameMinLength} from '@shared/constants';
import {IsYearAndMonth} from '@be/util/validator-decorators/is-year-and-month';
import {ChildInput} from '@shared/child/child-input';



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
