import {IsEnum, IsString, IsUUID, Matches, MinLength} from 'class-validator';
import {
    nameMinLength,
    passwordMinLength,
    passwordPattern,
    Permission,
    PermissionT,
    UserCreation,
    UUID
} from '@melluin/common';
import {ApiProperty} from '@nestjs/swagger';

export class UserCreationDto implements UserCreation {

    @ApiProperty()
    @MinLength(nameMinLength)
    userName: string;

    @ApiProperty()
    @MinLength(passwordMinLength)
    @Matches(passwordPattern)
    password: string;

    @ApiProperty()
    @IsUUID()
    personId: UUID;

    @ApiProperty({type: [String]})
    @IsString({each: true})
    roleNames: Array<string>;

    @ApiProperty({enum: Permission, isArray: true})
    @IsEnum(Permission, {each: true})
    customPermissions: Array<PermissionT>;

}
