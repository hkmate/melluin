import {IsEmail, IsEnum, IsOptional, IsPhoneNumber, MinLength, ValidateNested} from 'class-validator';
import {nameMinLength, OperationCity, PersonPreferences, PersonRewrite} from '@melluin/common';
import {Type} from 'class-transformer';
import {PersonPreferencesValidatedInput} from '@be/person/api/dto/person-preferences';

export class PersonRewriteValidatedInput implements PersonRewrite {

    @MinLength(nameMinLength)
    firstName: string;

    @MinLength(nameMinLength)
    lastName: string;

    @ValidateNested()
    @Type(() => PersonPreferencesValidatedInput)
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

