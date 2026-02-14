import {SetMetadata} from '@nestjs/common';
import {CustomDecorator} from '@nestjs/common/decorators/core/set-metadata.decorator';
import {RoleType} from '@shared/user/role';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Array<RoleType>): CustomDecorator => SetMetadata(ROLES_KEY, roles);
