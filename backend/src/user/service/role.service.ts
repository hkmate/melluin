import {BadRequestException, Injectable} from '@nestjs/common';
import {RoleDao} from '@be/user/role.dao';
import {RoleEntityToDtoConverter} from '@be/user/converter/role-entity-to-dto.converter';
import {RoleRewriteApplier} from '@be/user/applier/role-rewrite.applier';
import {PermissionDao} from '@be/user/permission.dao';
import {Role, RoleBrief, RoleCreation} from '@shared/user/role';
import {RoleCreationToEntityConverter} from '@be/user/converter/role-creation-to-entity.converter';
import {UserDao} from '@be/user/user.dao';
import {RoleEntityToBriefDtoConverter} from '@be/user/converter/role-entity-to-brief-dto.converter';

@Injectable()
export class RoleService {

    constructor(private readonly roleDao: RoleDao,
                private readonly userDao: UserDao,
                private readonly permissionDao: PermissionDao,
                private readonly creationToEntityConverter: RoleCreationToEntityConverter,
                private readonly roleConverter: RoleEntityToDtoConverter,
                private readonly roleBriefConverter: RoleEntityToBriefDtoConverter) {
    }

    public async getAll(): Promise<Array<Role>> {
        const entities = await this.roleDao.findAll();
        return entities.map(r => this.roleConverter.convert(r));
    }

    public async getAllBrief(): Promise<Array<RoleBrief>> {
        const entities = await this.roleDao.findAll();
        return entities.map(r => this.roleBriefConverter.convert(r));
    }

    public async create(roleCreation: RoleCreation): Promise<Role> {
        await this.verifyNoRoleWithName(roleCreation.name);
        const entity = await this.creationToEntityConverter.convert(roleCreation);

        const saved = await this.roleDao.save(entity);
        return this.roleConverter.convert(saved);
    }

    public async update(roleRewrite: Role): Promise<Role> {
        const entity = await this.roleDao.findById(roleRewrite.id);
        await new RoleRewriteApplier(this.permissionDao, roleRewrite).applyOn(entity);

        const saved = await this.roleDao.save(entity);
        return this.roleConverter.convert(saved);
    }

    public async delete(roleId: string): Promise<void> {
        await this.verifyNoUserWithRole(roleId);

        const entity = await this.roleDao.findById(roleId);

        await this.roleDao.delete(entity);
    }

    private async verifyNoRoleWithName(name: string): Promise<void> | never {
        const isAnyWithName = await this.roleDao.existsByName(name);
        if (isAnyWithName) {
            throw new BadRequestException('There is role with this name.');
        }
    }

    private async verifyNoUserWithRole(roleId: string): Promise<void> | never {
        const isAnyWithRole = await this.userDao.hasAnyWithRole(roleId);
        if (isAnyWithRole) {
            throw new BadRequestException('There is at least one user with this role.');
        }
    }

}
