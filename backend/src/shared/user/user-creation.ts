import {IsEnum, IsUUID, Matches, MinLength} from 'class-validator';
import {nameMinLength, passwordMinLength, passwordPattern} from '@shared/constants';
import {Role} from '@shared/user/role.enum';
import {Permission} from '@shared/user/permission.enum';

export class UserCreation {

    @MinLength(nameMinLength)
    userName: string;

    @MinLength(passwordMinLength)
    @Matches(passwordPattern)
    password: string;

    @IsUUID()
    personId: string;

    @IsEnum(Role, {each: true})
    roles: Array<Role>;

    @IsEnum(Permission, {each: true})
    customPermissions: Array<Permission>;

}
