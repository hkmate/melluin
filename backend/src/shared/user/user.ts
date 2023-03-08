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
    permissions: Array<Permission>;
    customInfo?: UserCustomInfo;
}

// TODO remove eslint-disable when there is something in the custom info
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UserCustomInfo {
}
