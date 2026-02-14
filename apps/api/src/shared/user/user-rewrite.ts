import {Permission} from '@shared/user/permission.enum';

export interface UserRewrite {

    userName: string;
    password?: string;
    isActive: boolean;
    roleNames: Array<string>;
    customPermissions: Array<Permission>;

}

