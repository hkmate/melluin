import {SetMetadata} from '@nestjs/common';
import {Role} from '../constant/role.enum';
import {CustomDecorator} from '@nestjs/common/decorators/core/set-metadata.decorator';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Array<Role>): CustomDecorator => SetMetadata(ROLES_KEY, roles);
