import {Applier, PermissionT, Role} from '@melluin/common';
import {RoleEntity} from '@be/user/model/role.entity';
import * as _ from 'lodash';
import {PermissionDao} from '@be/user/permission.dao';
import {PermissionEntity} from '@be/user/model/permission.entity';


export class RoleRewriteApplier implements Applier<RoleEntity> {

    constructor(private readonly permissionDao: PermissionDao,
                private readonly rewrite: Role) {
    }

    public async applyOn(persisted: RoleEntity): Promise<void> {
        persisted.name = this.rewrite.name;
        persisted.type = this.rewrite.type;
        if (!this.hasChanged(persisted.permissions, this.rewrite.permissions)) {
            return;
        }
        persisted.permissions = await this.getEntitiesFromRoles(this.rewrite.permissions);
    }

    private hasChanged(persisted: Array<PermissionEntity>, needed: Array<PermissionT>): boolean {
        return !_.isEqual(
            persisted.map(value => value.permission),
            needed
        );
    }

    private async getEntitiesFromRoles(roles: Array<PermissionT>): Promise<Array<PermissionEntity>> {
        const availablePermissionEntities = await this.permissionDao.findAll();
        return availablePermissionEntities.filter(e => roles.includes(e.permission));
    }

}
