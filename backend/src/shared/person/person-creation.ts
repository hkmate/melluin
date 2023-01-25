import {IsEmail, IsOptional, IsPhoneNumber, MinLength} from 'class-validator';
import {nameMinLength} from '@shared/constants';

export class PersonCreation {

    @MinLength(nameMinLength)
    firstName: string;

    @MinLength(nameMinLength)
    lastName: string;

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
