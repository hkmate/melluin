import {IsBoolean, IsEnum, IsOptional, IsString, Matches, MinLength} from 'class-validator';
import {nameMinLength, passwordMinLength, passwordPattern, Permission, PermissionT, UserRewrite} from '@melluin/common';
import { ApiProperty } from '@nestjs/swagger';

export class UserRewriteDto implements UserRewrite {

    @ApiProperty()
    @MinLength(nameMinLength)
    userName: string;

    @ApiProperty({required: false})
    @MinLength(passwordMinLength)
    @Matches(passwordPattern)
    @IsOptional()
    password?: string;

    @ApiProperty()
    @IsBoolean()
    isActive: boolean;

    @ApiProperty({type: [String]})
    @IsString({each: true})
    roleNames: Array<string>;

    @ApiProperty({enum: Permission, isArray: true})
    @IsEnum(Permission, {each: true})
    customPermissions: Array<PermissionT>;

}

