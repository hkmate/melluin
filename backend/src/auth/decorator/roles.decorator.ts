import {SetMetadata} from '@nestjs/common';
import {CustomDecorator} from '@nestjs/common/decorators/core/set-metadata.decorator';
import {Role} from '@shared/user/role.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Array<Role>): CustomDecorator => SetMetadata(ROLES_KEY, roles);
