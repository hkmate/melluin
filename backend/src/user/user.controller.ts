import {Body, Controller, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post, Put} from '@nestjs/common';
import {User} from '@shared/user/user';
import {CurrentUser} from '@be/auth/decorator/current-user.decorator';
import {UserCreation} from '@shared//user/user-creation';
import {UserRewrite} from '@shared/user/user-rewrite';
import {UserService} from '@be/user/service/user.service';
import {PermissionGuard} from '@be/auth/decorator/permissions.decorator';
import {Permission} from '@shared/user/permission.enum';


@Controller('users')
export class UserController {

    constructor(private readonly userService: UserService) {
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @PermissionGuard(Permission.canCreateUser)
    public save(@Body() userCreation: UserCreation,
                @CurrentUser() requester: User): Promise<User> {
        return this.userService.save(userCreation, requester);
    }

    @Get('/:id')
    @PermissionGuard(Permission.canReadPerson)
    public get(@Param('id', ParseUUIDPipe) userId: string,
               @CurrentUser() requester: User): Promise<User> {
        return this.userService.get(userId, requester);
    }

    @Put('/:id')
    @PermissionGuard(Permission.canWriteVisitor, Permission.canWriteCoordinator,
        Permission.canWriteAdmin, Permission.canWriteSysAdmin)
    public update(@Param('id', ParseUUIDPipe) userId: string,
                  @Body() userRewrite: UserRewrite,
                  @CurrentUser() requester: User): Promise<User> {
        return this.userService.update(userId, userRewrite, requester);
    }

}
