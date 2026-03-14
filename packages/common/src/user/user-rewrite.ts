import {PermissionT} from './permission.enum';

export interface UserRewrite {

    userName: string;
    password?: string;
    isActive: boolean;
    roleNames: Array<string>;
    customPermissions: Array<PermissionT>;

}
