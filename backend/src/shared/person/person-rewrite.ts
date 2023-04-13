import {IsEmail, IsInstance, IsOptional, IsPhoneNumber, MinLength} from 'class-validator';
import {nameMinLength} from '@shared/constants';
import {PersonPreferences} from '@shared/person/person';

export class PersonRewrite {

    @MinLength(nameMinLength)
    firstName: string;

    @MinLength(nameMinLength)
    lastName: string;

    @MinLength(nameMinLength)
    @IsOptional()
    nickName?: string;

    @IsInstance(PersonPreferences)
    @IsOptional()
    preferences?: PersonPreferences;

    @IsEmail()
    @IsOptional()
    email?: string;

    @IsPhoneNumber()
    @IsOptional()
    phone?: string;

}

