import {PermissionT} from './permission.enum';
import {UUID} from '../util/type/uuid.type';

export interface UserCreation {

    userName: string;
    password: string;
    personId: UUID;
    roleNames: Array<string>;
    customPermissions: Array<PermissionT>;

}
