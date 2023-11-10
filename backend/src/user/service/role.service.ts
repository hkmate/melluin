import {Injectable} from '@nestjs/common';
import {RoleDao} from '@be/user/role.dao';
import {RoleEntityToDtoConverter} from '@be/user/converter/role-entity-to-dto.converter';
import {RolePermission} from '@shared/user/role.enum';
import {RolePermissionRewriteApplier} from '@be/user/applier/role-permission-rewrite.applier';
import {PermissionDao} from '@be/user/permission.dao';

@Injectable()
export class RoleService {

    constructor(private readonly roleDao: RoleDao,
                private readonly permissionDao: PermissionDao,
                private readonly roleConverter: RoleEntityToDtoConverter) {
    }

    public async getAll(): Promise<Array<RolePermission>> {
        const entities = await this.roleDao.findAll();
        return entities.map(r => this.roleConverter.convert(r));
    }

    public async update(roleRewrite: RolePermission): Promise<RolePermission> {
        const entity = await this.roleDao.find(roleRewrite.role);
        await new RolePermissionRewriteApplier(this.permissionDao, roleRewrite).applyOn(entity);

        const saved = await this.roleDao.save(entity);
        return this.roleConverter.convert(saved);
    }

}
