import {IsOptional, IsString, Matches, MinLength} from 'class-validator';
import {ChildInput, childMinBirthYear, nameMinLength} from '@melluin/common';
import {IsYearAndMonth} from '@be/util/validator-decorators/is-year-and-month';
import { ApiProperty } from '@nestjs/swagger';


export class ChildInputDto implements ChildInput {

    @ApiProperty()
    @IsString()
    @MinLength(nameMinLength)
    name: string;

    @ApiProperty()
    @IsString()
    @Matches(/\d\d\d\d\.\d\d/)
    @IsYearAndMonth(childMinBirthYear)
    guessedBirth: string;

    @ApiProperty({required: false})
    @IsString()
    @IsOptional()
    info?: string;

}
