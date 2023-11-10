import {BadRequestException, Body, Controller, Get, NotFoundException, Param, Put} from '@nestjs/common';
import {PermissionGuard} from '@be/auth/decorator/permissions.decorator';
import {Permission} from '@shared/user/permission.enum';
import {Role, RolePermission} from '@shared/user/role.enum';
import {RoleService} from '@be/user/service/role.service';


@Controller('roles')
export class RoleController {

    constructor(private readonly roleService: RoleService) {
    }

    @Get()
    @PermissionGuard(Permission.canManagePermissions)
    public get(): Promise<Array<RolePermission>> {
        return this.roleService.getAll();
    }

    @Put('/:name')
    @PermissionGuard(Permission.canManagePermissions)
    public update(@Param('name') roleName: string,
                  @Body() roleRewrite: RolePermission): Promise<RolePermission> {
        if (!Object.keys(Role).includes(roleName)) {
            throw new NotFoundException(`Unknown role: ${roleName}`);
        }
        if (roleName !== roleRewrite.role) {
            throw new BadRequestException(`Referenced role (${roleName}) is not same as one to rewrite (${roleRewrite.role})`);
        }
        return this.roleService.update(roleRewrite);
    }

}
