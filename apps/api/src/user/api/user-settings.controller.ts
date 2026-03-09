import {Body, Controller, ForbiddenException, Get, Param, ParseUUIDPipe, Put} from '@nestjs/common';
import {User, UserSettings, UUID} from '@melluin/common';
import {CurrentUser} from '@be/auth/decorator/current-user.decorator';
import {UserSettingsService} from '@be/user/service/user-settings.service';
import {UserSettingsDto} from '@be/user/api/dto/user-settings.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('users')
export class UserSettingsController {

    constructor(private readonly userSettingsService: UserSettingsService) {
    }

    @Get('/:id/settings')
    public get(@Param('id', ParseUUIDPipe) userId: UUID,
               @CurrentUser() requester: User): Promise<UserSettings> {
        if (userId !== requester.id) {
            throw new ForbiddenException('You can read only your own settings!');
        }
        return this.userSettingsService.get(userId, requester);
    }

    @Put('/:id/settings')
    public update(@Param('id', ParseUUIDPipe) userId: UUID,
                  @Body() newSettings: UserSettingsDto,
                  @CurrentUser() requester: User): Promise<UserSettings> {
        if (userId !== requester.id) {
            throw new ForbiddenException('You can change only your own settings!');
        }
        return this.userSettingsService.update(userId, newSettings, requester);
    }

}
