import {Permission} from '@shared/user/permission.enum';

export interface UserCreation {

    userName: string;
    password: string;
    personId: string;
    roleNames: Array<string>;
    customPermissions: Array<Permission>;

}
