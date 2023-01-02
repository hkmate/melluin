import {Role} from './role.enum';

export interface User {
    id: string;
    roles: Array<Role>;
    userName: string;
    password?: string;
    isActive: boolean;
    customInfo?: UserCustomInfo;
}

// TODO remove eslint-disable when there is something in the custom info
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UserCustomInfo {
}
