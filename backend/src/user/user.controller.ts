import {Body, Controller, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post, Put} from '@nestjs/common';
import {User} from '@shared/user/user';
import {CurrentUser} from '@be/auth/decorator/current-user.decorator';
import {Roles} from '@be/auth/decorator/roles.decorator';
import {foundationEmployeeRoles} from '@shared/user/role.enum';
import {UserCreation} from '@be/user/model/user-creation';
import {UserUpdate} from '@be/user/model/user-update';
import {UserService} from '@be/user/service/user.service';


@Controller('users')
export class UserController {

    constructor(private readonly userService: UserService) {
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @Roles(...foundationEmployeeRoles)
    public save(@Body() userCreation: UserCreation,
                @CurrentUser() requester: User): Promise<User> {
        return this.userService.save(userCreation, requester);
    }

    @Put('/:id')
    public update(@Param('id', ParseUUIDPipe) personId: string,
                  @Body() updateChangeSet: UserUpdate,
                  @CurrentUser() requester: User): Promise<User> {
        return this.userService.update(personId, updateChangeSet, requester);
    }

}
