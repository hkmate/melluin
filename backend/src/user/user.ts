import {Role} from '../auth/constant/role.enum';

export interface User {

    id: string;
    roles: Array<Role>;
    userName: string;
    password: string;

}
