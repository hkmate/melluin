import {Permission, PermissionT} from './permission.enum';
import {cast} from '../util/test-util';
import {UUID} from '../util/type/uuid.type';
import {EnumTypeOf} from '../util/type/enum.type';

export const RoleTypes = {
    INTERN: 'INTERN',
    VISITOR: 'VISITOR',
    COORDINATOR: 'COORDINATOR',
    ADMINISTRATOR: 'ADMINISTRATOR',
    SYSADMIN: 'SYSADMIN',
} as const;
export type RoleType = EnumTypeOf<typeof RoleTypes>;

export interface RoleBrief {

    name: string;
    type: RoleType;

}

export interface Role extends RoleBrief {

    id: UUID;
    permissions: Array<PermissionT>;

}

export interface RoleCreation {

    name: string;
    type: RoleType;
    permissions: Array<PermissionT>;

}

export function getPermissionsNeededToChangeRole(role: RoleType): PermissionT {
    switch (role) {
        case RoleTypes.INTERN:
        case RoleTypes.VISITOR:
            return Permission.canWriteVisitor;
        case RoleTypes.COORDINATOR:
            return Permission.canWriteCoordinator;
        case RoleTypes.ADMINISTRATOR:
            return Permission.canWriteAdmin;
        case RoleTypes.SYSADMIN:
            return Permission.canWriteSysAdmin;
    }
    return cast<PermissionT>(undefined);
}

