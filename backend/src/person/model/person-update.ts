import {IsEmail, IsOptional, IsPhoneNumber, MinLength} from 'class-validator';
import {nameMinLength} from '@shared/constants';

export class PersonUpdate {

    @MinLength(nameMinLength)
    @IsOptional()
    firstName?: string;

    @MinLength(nameMinLength)
    @IsOptional()
    lastName?: string;

    @MinLength(nameMinLength)
    @IsOptional()
    nickName?: string;

    @IsEmail()
    @IsOptional()
    email?: string;

    @IsPhoneNumber()
    @IsOptional()
    phone?: string;

}

