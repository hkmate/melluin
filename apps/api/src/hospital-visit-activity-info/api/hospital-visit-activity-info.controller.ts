import {Body, Controller, Get, Param, ParseUUIDPipe, Put} from '@nestjs/common';
import {HospitalVisitActivityInfo, HospitalVisitActivityInfoInput, Permission, User} from '@melluin/common';
import {CurrentUser} from '@be/auth/decorator/current-user.decorator';
import {PermissionGuard} from '@be/auth/decorator/permissions.decorator';
import {HospitalVisitActivityInfoCrudService} from '@be/hospital-visit-activity-info/hospital-visit-activity-info.crud.service';
import {HospitalVisitActivityInfoDto} from '@be/hospital-visit-activity-info/api/dto/hospital-visit-activity-info-input.dto';
import { ApiBearerAuth } from '@nestjs/swagger';


@ApiBearerAuth()
@Controller('hospital-visits')
export class HospitalVisitActivityInfoController {

    constructor(private readonly crudService: HospitalVisitActivityInfoCrudService) {
    }

    @Get('/:visitId/activities-information')
    @PermissionGuard(Permission.canReadActivity)
    public getInformation(@Param('visitId', ParseUUIDPipe) visitId: string,
                          @CurrentUser() requester: User): Promise<HospitalVisitActivityInfo> {
        return this.crudService.getActivityInfo(visitId, requester);
    }

    @Put('/:visitId/activities-information')
    @PermissionGuard(Permission.canCreateActivity, Permission.canWriteActivityAtAnyVisit)
    public setUpInformation(@Param('visitId', ParseUUIDPipe) visitId: string,
                            @Body() activityInput: HospitalVisitActivityInfoDto,
                            @CurrentUser() requester: User): Promise<HospitalVisitActivityInfoInput> {
        return this.crudService.addActivityInfo(visitId, activityInput, requester);
    }

}
