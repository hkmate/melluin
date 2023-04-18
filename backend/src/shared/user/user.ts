import {Role} from './role.enum';
import {Permission} from '@shared/user/permission.enum';
import {IsOptional} from 'class-validator';

export interface BriefUser {
    id: string;
    personId: string;
    roles: Array<Role>;
    isActive: boolean;
}

export interface User extends BriefUser {
    userName: string;
    permissions: Array<Permission>;
    customInfo?: UserCustomInfo;
}

export class UserCustomInfo {

    // Note: this is for class-validator because it does not like empty classes
    @IsOptional()
    _?: string;

}
