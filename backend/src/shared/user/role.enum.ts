import {Permission} from '@shared/user/permission.enum';
import {cast} from '@shared/util/test-util';
import {IsEnum, IsString, IsUUID} from 'class-validator';

export enum Role {

    INTERN_HOSPITAL_VISITOR = 'INTERN_HOSPITAL_VISITOR',
    BEGINNER_HOSPITAL_VISITOR = 'BEGINNER_HOSPITAL_VISITOR',
    HOSPITAL_VISITOR = 'HOSPITAL_VISITOR',
    MENTOR_HOSPITAL_VISITOR = 'MENTOR_HOSPITAL_VISITOR',
    HOSPITAL_VISIT_COORDINATOR = 'HOSPITAL_VISIT_COORDINATOR',
    FAIRY_PAINTING_COORDINATOR = 'FAIRY_PAINTING_COORDINATOR',
    TOY_MAKING_COORDINATOR = 'TOY_MAKING_COORDINATOR',
    ADMINISTRATOR = 'ADMINISTRATOR',
    SYSADMIN = 'SYSADMIN',
}

export const foundationWorkerRoles = [
    Role.HOSPITAL_VISIT_COORDINATOR,
    Role.FAIRY_PAINTING_COORDINATOR,
    Role.TOY_MAKING_COORDINATOR,
    Role.ADMINISTRATOR,
    Role.SYSADMIN
];

export class RolePermission {

    @IsString()
    @IsUUID()
    id: string;

    @IsEnum(Role)
    role: Role;

    @IsEnum(Permission, {each: true})
    permissions: Array<Permission>;

}

// eslint-disable-next-line max-lines-per-function
export function getPermissionsNeededToChangeRole(role: Role): Permission {
    switch (role) {
        case Role.INTERN_HOSPITAL_VISITOR:
        case Role.BEGINNER_HOSPITAL_VISITOR:
        case Role.HOSPITAL_VISITOR:
        case Role.MENTOR_HOSPITAL_VISITOR:
            return Permission.canWriteVisitor;
        case Role.HOSPITAL_VISIT_COORDINATOR:
        case Role.FAIRY_PAINTING_COORDINATOR:
        case Role.TOY_MAKING_COORDINATOR:
            return Permission.canWriteCoordinator;
        case Role.ADMINISTRATOR:
            return Permission.canWriteAdmin;
        case Role.SYSADMIN:
            return Permission.canWriteSysAdmin;
    }
    return cast<Permission>(undefined);
}

