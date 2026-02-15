import {IsEmail, IsEnum, IsOptional, IsPhoneNumber, MinLength, ValidateNested} from 'class-validator';
import {nameMinLength, OperationCity, PersonCreation, PersonPreferences} from '@melluin/common';
import {Type} from 'class-transformer';
import {PersonPreferencesValidatedInput} from '@be/person/api/dto/person-preferences';

export class PersonCreationValidatedInput implements PersonCreation {

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
