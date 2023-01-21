import {IsDefined, IsEmail, IsOptional, IsPhoneNumber, MinLength} from 'class-validator';
import {nameMinLength} from '@shared/constants';

export class PersonCreation {

    @MinLength(nameMinLength)
    @IsDefined()
    firstName: string;

    @MinLength(nameMinLength)
    @IsDefined()
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
