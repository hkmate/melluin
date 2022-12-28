import {Role} from './role.enum';

export interface User {

    id: string;
    roles: Array<Role>;
    userName: string;
    password?: string;
    isActive: boolean;

}
