import {Body, Controller, Get, Param, ParseUUIDPipe, Put} from '@nestjs/common';
import {VisitActivityInfo, VisitActivityInfoInput, Permission, User, UUID} from '@melluin/common';
import {CurrentUser} from '@be/auth/decorator/current-user.decorator';
import {PermissionGuard} from '@be/auth/decorator/permissions.decorator';
import {VisitActivityInfoCrudService} from '@be/visit-activity-info/visit-activity-info.crud.service';
import {VisitActivityInfoDto} from '@be/visit-activity-info/api/dto/visit-activity-info-input.dto';
import { ApiBearerAuth } from '@nestjs/swagger';


@ApiBearerAuth()
@Controller('visits')
export class VisitActivityInfoController {

    constructor(private readonly crudService: VisitActivityInfoCrudService) {
    }

    @Get('/:visitId/activities-information')
    @PermissionGuard(Permission.canReadActivity)
    public getInformation(@Param('visitId', ParseUUIDPipe) visitId: UUID,
                          @CurrentUser() requester: User): Promise<VisitActivityInfo> {
        return this.crudService.getActivityInfo(visitId, requester);
    }

    @Put('/:visitId/activities-information')
    @PermissionGuard(Permission.canCreateActivity, Permission.canWriteActivityAtAnyVisit)
    public setUpInformation(@Param('visitId', ParseUUIDPipe) visitId: UUID,
                            @Body() activityInput: VisitActivityInfoDto,
                            @CurrentUser() requester: User): Promise<VisitActivityInfoInput> {
        return this.crudService.addActivityInfo(visitId, activityInput, requester);
    }

}
