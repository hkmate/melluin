import {Applier} from '@shared/applier';
import {RoleEntity} from '@be/user/model/role.entity';
import {RolePermission} from '@shared/user/role.enum';
import * as _ from 'lodash';
import {PermissionDao} from '@be/user/permission.dao';
import {PermissionEntity} from '@be/user/model/permission.entity';
import {Permission} from '@shared/user/permission.enum';


export class RolePermissionRewriteApplier implements Applier<RoleEntity> {

    constructor(private readonly permissionDao: PermissionDao,
                private readonly rewrite: RolePermission) {
    }

    public async applyOn(persisted: RoleEntity): Promise<void> {
        if (!this.hasChanged(persisted.permissions, this.rewrite.permissions)) {
            return;
        }
        persisted.permissions = await this.getEntitiesFromRoles(this.rewrite.permissions);
    }

    private hasChanged(persisted: Array<PermissionEntity>, needed: Array<Permission>): boolean {
        return !_.isEqual(
            persisted.map(value => value.permission),
            needed
        );
    }

    private async getEntitiesFromRoles(roles: Array<Permission>): Promise<Array<PermissionEntity>> {
        const availablePermissionEntities = await this.permissionDao.findAll();
        return availablePermissionEntities.filter(e => roles.includes(e.permission));
    }

}
