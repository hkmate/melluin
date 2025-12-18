import {IsEmail, IsEnum, IsOptional, IsPhoneNumber, MinLength, ValidateNested} from 'class-validator';
import {nameMinLength} from '@shared/constants';
import {PersonPreferences} from '@shared/person/person';
import {Type} from 'class-transformer';
import {OperationCity} from '@shared/person/operation-city';

export class PersonRewrite {

    @MinLength(nameMinLength)
    firstName: string;

    @MinLength(nameMinLength)
    lastName: string;

    @ValidateNested()
    @Type(() => PersonPreferences)
    @IsOptional()
    preferences?: PersonPreferences;

    @IsEmail()
    @IsOptional()
    email?: string;

    @IsPhoneNumber()
    @IsOptional()
    phone?: string;

    @IsEnum(OperationCity, {each: true})
    cities: Array<OperationCity>;

}

