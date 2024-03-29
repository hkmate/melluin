import {IsBoolean, IsEnum, IsOptional, Matches, MinLength} from 'class-validator';
import {nameMinLength, passwordMinLength, passwordPattern} from '@shared/constants';
import {Role} from '@shared/user/role.enum';
import {Permission} from '@shared/user/permission.enum';

export class UserRewrite {

    @MinLength(nameMinLength)
    userName: string;

    @MinLength(passwordMinLength)
    @Matches(passwordPattern)
    @IsOptional()
    password?: string;

    @IsBoolean()
    isActive: boolean;

    @IsEnum(Role, {each: true})
    roles: Array<Role>;

    @IsEnum(Permission, {each: true})
    customPermissions: Array<Permission>;

}

