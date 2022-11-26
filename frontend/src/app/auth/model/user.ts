import {Role} from "./role.enum";

export class User {
    id: string;
    roles: Array<Role>;
    userName: string;
    password: string;
}
