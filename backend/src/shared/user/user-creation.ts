import {IsEnum, IsInstance, IsOptional, IsUUID, Matches, MinLength} from 'class-validator';
import {nameMinLength, passwordMinLength, passwordPattern} from '@shared/constants';
import {Role} from '@shared/user/role.enum';
import {UserCustomInfo} from '@shared/user/user';

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

    @IsInstance(UserCustomInfo)
    @IsOptional()
    customInfo?: UserCustomInfo;

}
