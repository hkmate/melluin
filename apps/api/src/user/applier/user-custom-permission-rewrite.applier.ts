import {Applier, PermissionT, UserRewrite} from '@melluin/common';
import {UserEntity} from '@be/user/model/user.entity';
import * as _ from 'lodash';
import {PermissionEntity} from '@be/user/model/permission.entity';
import {PermissionDao} from '@be/user/permission.dao';


export class UserCustomPermissionRewriteApplier implements Applier<UserEntity> {

    constructor(private readonly permissionDao: PermissionDao,
                private readonly rewrite: UserRewrite) {
    }

    public async applyOn(persisted: UserEntity): Promise<void> {
        if (!this.hasChanged(persisted.customPermissions, this.rewrite.customPermissions)) {
            return;
        }
        persisted.customPermissions = await this.getEntitiesFromPermissions(this.rewrite.customPermissions);
    }

    private hasChanged(persisted: Array<PermissionEntity>, needed: Array<PermissionT>): boolean {
        return !_.isEqual(
            persisted.map(value => value.permission),
            needed
        );
    }

    private async getEntitiesFromPermissions(roles: Array<PermissionT>): Promise<Array<PermissionEntity>> {
        const availablePermissionEntities = await this.permissionDao.findAll();
        return availablePermissionEntities.filter(e => roles.includes(e.permission));
    }

}
