import {IsEnum, IsOptional, IsUUID, Matches, MinLength, ValidateNested} from 'class-validator';
import {nameMinLength, passwordMinLength, passwordPattern} from '@shared/constants';
import {Role} from '@shared/user/role.enum';
import {UserCustomInfo} from '@shared/user/user';
import {Type} from 'class-transformer';

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

    @ValidateNested()
    @Type(() => UserCustomInfo)
    @IsOptional()
    customInfo?: UserCustomInfo;

}
