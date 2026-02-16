import {Body, Controller, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post, Put} from '@nestjs/common';
import {Permission, User} from '@melluin/common';
import {CurrentUser} from '@be/auth/decorator/current-user.decorator';
import {UserService} from '@be/user/service/user.service';
import {PermissionGuard} from '@be/auth/decorator/permissions.decorator';
import {UserCreationDto} from '@be/user/api/dto/user-creation.dto';
import {UserRewriteDto} from '@be/user/api/dto/user-rewrite.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('users')
export class UserController {

    constructor(private readonly userService: UserService) {
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @PermissionGuard(Permission.canCreateUser)
    public save(@Body() userCreation: UserCreationDto,
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
                  @Body() userRewrite: UserRewriteDto,
                  @CurrentUser() requester: User): Promise<User> {
        return this.userService.update(userId, userRewrite, requester);
    }

}
