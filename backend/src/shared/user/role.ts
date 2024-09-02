import {Permission} from '@shared/user/permission.enum';
import {cast} from '@shared/util/test-util';
import {IsEnum, IsString, IsUUID} from 'class-validator';

export enum RoleType {

    INTERN = 'INTERN',
    VISITOR = 'VISITOR',
    COORDINATOR = 'COORDINATOR',
    ADMINISTRATOR = 'ADMINISTRATOR',
    SYSADMIN = 'SYSADMIN',

}

export class RoleBrief {

    @IsString()
    name: string;

    @IsEnum(RoleType)
    type: RoleType;

}

export class Role extends RoleBrief {

    @IsString()
    @IsUUID()
    id: string;

    @IsEnum(Permission, {each: true})
    permissions: Array<Permission>;

}

export class RoleCreation {

    @IsString()
    name: string;

    @IsEnum(RoleType)
    type: RoleType;

    @IsEnum(Permission, {each: true})
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

