import {SetMetadata} from '@nestjs/common';
import {CustomDecorator} from '@nestjs/common/decorators/core/set-metadata.decorator';
import {Permission} from '@shared/user/permission.enum';

export const PERMISSIONS_KEY = 'permission';
export const PermissionGuard = (...permissions: Array<Permission>): CustomDecorator => SetMetadata(PERMISSIONS_KEY, permissions);
