import {IsEmail, IsEnum, IsOptional, IsPhoneNumber, MinLength, ValidateNested} from 'class-validator';
import {nameMinLength} from '@shared/constants';
import {Type} from 'class-transformer';
import {OperationCity} from '@shared/person/operation-city';
import {PersonCreation} from '@shared/person/person-creation';
import {PersonPreferencesValidatedInput} from '@be/person/api/dto/person-preferences';
import {PersonPreferences} from '@shared/person/person-preferences';

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
