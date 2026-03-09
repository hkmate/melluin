import {Permission} from './permission.enum';
import {cast} from '../util/test-util';
import {UUID} from '../util/type/uuid.type';

export enum RoleType {

    INTERN = 'INTERN',
    VISITOR = 'VISITOR',
    COORDINATOR = 'COORDINATOR',
    ADMINISTRATOR = 'ADMINISTRATOR',
    SYSADMIN = 'SYSADMIN',

}

export interface RoleBrief {

    name: string;
    type: RoleType;

}

export interface Role extends RoleBrief {

    id: UUID;
    permissions: Array<Permission>;

}

export interface RoleCreation {

    name: string;
    type: RoleType;
    permissions: Array<Permission>;

}

export function getPermissionsNeededToChangeRole(role: RoleType): Permission {
    switch (role) {
        case RoleType.INTERN:
        case RoleType.VISITOR:
            return Permission.canWriteVisitor;
        case RoleType.COORDINATOR:
            return Permission.canWriteCoordinator;
        case RoleType.ADMINISTRATOR:
            return Permission.canWriteAdmin;
        case RoleType.SYSADMIN:
            return Permission.canWriteSysAdmin;
    }
    return cast<Permission>(undefined);
}

