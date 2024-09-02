import {IsEnum, IsString, IsUUID, Matches, MinLength} from 'class-validator';
import {nameMinLength, passwordMinLength, passwordPattern} from '@shared/constants';
import {Permission} from '@shared/user/permission.enum';

export class UserCreation {

    @MinLength(nameMinLength)
    userName: string;

    @MinLength(passwordMinLength)
    @Matches(passwordPattern)
    password: string;

    @IsUUID()
    personId: string;

    @IsString({each: true})
    roleNames: Array<string>;

    @IsEnum(Permission, {each: true})
    customPermissions: Array<Permission>;

}
