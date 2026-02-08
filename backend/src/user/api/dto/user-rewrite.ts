import {IsBoolean, IsEnum, IsOptional, IsString, Matches, MinLength} from 'class-validator';
import {nameMinLength, passwordMinLength, passwordPattern} from '@shared/constants';
import {Permission} from '@shared/user/permission.enum';
import {UserRewrite} from '@shared/user/user-rewrite';

export class UserRewriteValidatedInput implements UserRewrite {

    @MinLength(nameMinLength)
    userName: string;

    @MinLength(passwordMinLength)
    @Matches(passwordPattern)
    @IsOptional()
    password?: string;

    @IsBoolean()
    isActive: boolean;

    @IsString({each: true})
    roleNames: Array<string>;

    @IsEnum(Permission, {each: true})
    customPermissions: Array<Permission>;

}

