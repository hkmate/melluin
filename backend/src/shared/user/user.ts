import {Role} from './role.enum';
import {Permission} from '@shared/user/permission.enum';

export interface BriefUser {
    id: string;
    personId: string;
    roles: Array<Role>;
    isActive: boolean;
}

export interface User extends BriefUser {
    userName: string;
    customPermissions: Array<Permission>;
    permissions: Array<Permission>;
}
