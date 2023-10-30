import {Body, Controller, ForbiddenException, Get, Param, ParseUUIDPipe, Put} from '@nestjs/common';
import {User, UserSettings} from '@shared/user/user';
import {CurrentUser} from '@be/auth/decorator/current-user.decorator';
import {UserSettingsService} from '@be/user/service/user-settings.service';


@Controller('users')
export class UserSettingsController {

    constructor(private readonly userSettingsService: UserSettingsService) {
    }

    @Get('/:id')
    public get(@Param('id', ParseUUIDPipe) userId: string,
               @CurrentUser() requester: User): Promise<UserSettings> {
        if (userId !== requester.id) {
            throw new ForbiddenException('You can read only your own settings!');
        }
        return this.userSettingsService.get(userId, requester);
    }

    @Put('/:id')
    public update(@Param('id', ParseUUIDPipe) userId: string,
                  @Body() newSettings: UserSettings,
                  @CurrentUser() requester: User): Promise<UserSettings> {
        if (userId !== requester.id) {
            throw new ForbiddenException('You can change only your own settings!');
        }
        return this.userSettingsService.update(userId, newSettings, requester);
    }

}
