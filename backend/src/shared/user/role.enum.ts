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

export const coordinatorRoles: Array<Role> = [
    Role.FAIRY_PAINTING_COORDINATOR,
    Role.TOY_MAKING_COORDINATOR,
    Role.HOSPITAL_VISIT_COORDINATOR
];

export const foundationEmployeeRoles: Array<Role> = [
    ...coordinatorRoles,
    Role.ADMINISTRATOR,
    Role.SYSADMIN
];

export interface RoleHolder {
    roles: Array<Role>;
}

export function isUserAnEmployee(user: RoleHolder): boolean {
    return isUserHasAnyRoleOf(user, foundationEmployeeRoles);
}

export function isUserHasAnyRoleOf(user: RoleHolder, requiredRoles: Array<Role>): boolean {
    return user.roles.some(role => requiredRoles.includes(role));
}
