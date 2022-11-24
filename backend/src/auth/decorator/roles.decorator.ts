import {SetMetadata} from '@nestjs/common';
import {Role} from '../constant/role.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Array<Role>) => SetMetadata(ROLES_KEY, roles);