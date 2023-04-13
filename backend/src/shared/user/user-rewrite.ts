import {IsBoolean, IsEnum, IsInstance, IsOptional, Matches, MinLength} from 'class-validator';
import {nameMinLength, passwordMinLength, passwordPattern} from '@shared/constants';
import {Role} from '@shared/user/role.enum';
import {UserCustomInfo} from '@shared/user/user';

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

    @IsInstance(UserCustomInfo)
    @IsOptional()
    customInfo?: UserCustomInfo;

}

