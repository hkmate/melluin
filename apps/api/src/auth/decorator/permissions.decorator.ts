import {SetMetadata} from '@nestjs/common';
import {CustomDecorator} from '@nestjs/common/decorators/core/set-metadata.decorator';
import {PermissionT} from '@melluin/common';

export const PERMISSIONS_KEY = 'permission';
export const PermissionGuard = (...permissions: Array<PermissionT>): CustomDecorator => SetMetadata(PERMISSIONS_KEY, permissions);
