import {IsEnum, IsString, IsUUID, Matches, MinLength} from 'class-validator';
import {nameMinLength, passwordMinLength, passwordPattern, Permission, UserCreation} from '@melluin/common';

export class UserCreationValidatedInput implements UserCreation {

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
