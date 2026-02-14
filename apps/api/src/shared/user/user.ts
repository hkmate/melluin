import { Permission } from '@shared/user/permission.enum';
import { RoleBrief } from '@shared/user/role';

export interface BriefUser {
    id: string;
    personId: string;
    roles: Array<RoleBrief>;
    isActive: boolean;
    lastLogin?: string;
}

export interface User extends BriefUser {
    userName: string;
    customPermissions: Array<Permission>;
    permissions: Array<Permission>;
    created?: string;
    createdByPersonId?: string;
}
