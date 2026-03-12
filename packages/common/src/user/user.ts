import {PermissionT} from './permission.enum';
import {RoleBrief} from './role';
import {UUID} from '../util/type/uuid.type';

export interface BriefUser {
    id: UUID;
    personId: UUID;
    roles: Array<RoleBrief>;
    isActive: boolean;
    lastLogin?: string;
}

export interface User extends BriefUser {
    userName: string;
    customPermissions: Array<PermissionT>;
    permissions: Array<PermissionT>;
    created?: string;
    createdByPersonId?: UUID;
}
