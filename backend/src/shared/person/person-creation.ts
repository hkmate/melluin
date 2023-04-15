import {IsEmail, IsOptional, IsPhoneNumber, MinLength, ValidateNested} from 'class-validator';
import {nameMinLength} from '@shared/constants';
import {PersonPreferences} from '@shared/person/person';
import {Type} from 'class-transformer';

export class PersonCreation {

    @MinLength(nameMinLength)
    firstName: string;

    @MinLength(nameMinLength)
    lastName: string;

    @MinLength(nameMinLength)
    @IsOptional()
    nickName?: string;

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

}
