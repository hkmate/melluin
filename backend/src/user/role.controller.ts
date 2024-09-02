import {BadRequestException, Body, Controller, Delete, Get, Param, Post, Put} from '@nestjs/common';
import {PermissionGuard} from '@be/auth/decorator/permissions.decorator';
import {Permission} from '@shared/user/permission.enum';
import {RoleService} from '@be/user/service/role.service';
import {Role, RoleBrief, RoleCreation} from '@shared/user/role';


@Controller('roles')
export class RoleController {

    constructor(private readonly roleService: RoleService) {
    }

    @Get()
    @PermissionGuard(Permission.canManagePermissions)
    public get(): Promise<Array<Role>> {
        return this.roleService.getAll();
    }

    @Get('/[:]brief')
    public getBriefs(): Promise<Array<RoleBrief>> {
        return this.roleService.getAllBrief();
    }

    @Post()
    @PermissionGuard(Permission.canManagePermissions)
    public create(@Body() roleCreation: RoleCreation): Promise<Role> {
        return this.roleService.create(roleCreation);
    }

    @Put('/:id')
    @PermissionGuard(Permission.canManagePermissions)
    public update(@Param('id') roleId: string,
                  @Body() roleRewrite: Role): Promise<Role> {
        if (roleId !== roleRewrite.id) {
            throw new BadRequestException(`Referenced role id (${roleId}) is not same as one to rewrite (${roleRewrite.id})`);
        }
        return this.roleService.update(roleRewrite);
    }

    @Delete('/:id')
    @PermissionGuard(Permission.canManagePermissions)
    // TODO Add new permission: canManageRoles. This canManagePermissions will only for change custom permissions on user
    public delete(@Param('id') roleId: string): Promise<void> {
        return this.roleService.delete(roleId);
    }

}
