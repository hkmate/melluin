import {Body, Controller, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post} from '@nestjs/common';
import {User} from '@shared/user/user';
import {CurrentUser} from '@be/auth/decorator/current-user.decorator';
import {HospitalVisitActivityInput} from '@shared/hospital-visit-activity/hospital-visit-activity-input';
import {HospitalVisitActivityCrudService} from '@be/hospital-visit-activity/hospital-visit-activity.crud.service';
import {HospitalVisitActivity} from '@shared/hospital-visit-activity/hospital-visit-activity';
import {WrappedHospitalVisitActivity} from '@shared/hospital-visit-activity/wrapped-hospital-visit-activity';
import {HospitalVisitRelationDao} from '@be/hospital-visit/hospital-visit-relation.dao';
import {PermissionGuard} from '@be/auth/decorator/permissions.decorator';
import {Permission} from '@shared/user/permission.enum';


@Controller('hospital-visits')
export class HospitalVisitActivityController {

    constructor(private readonly activityCrudService: HospitalVisitActivityCrudService,
                private readonly visitRelationDao: HospitalVisitRelationDao) {
    }

    @Post('/:id/activities')
    @HttpCode(HttpStatus.CREATED)
    @PermissionGuard(Permission.canCreateActivity)
    public save(@Param('id', ParseUUIDPipe) hospitalVisitId: string,
                @Body() activityInput: HospitalVisitActivityInput,
                @CurrentUser() requester: User): Promise<HospitalVisitActivity> {
        activityInput.visitId = hospitalVisitId;
        return this.activityCrudService.save(activityInput, requester);
    }

    @Post('/:visitId/activities/:id')
    @HttpCode(HttpStatus.CREATED)
    @PermissionGuard(Permission.canCreateActivity)
    public update(@Param('id', ParseUUIDPipe) activityId: string,
                  @Body() activityInput: HospitalVisitActivityInput,
                  @CurrentUser() requester: User): Promise<HospitalVisitActivity> {
        return this.activityCrudService.update(activityId, activityInput, requester);
    }

    @Get('/:id/activities')
    @PermissionGuard(Permission.canReadActivity)
    public find(@Param('id', ParseUUIDPipe) hospitalVisitId: string,
                @CurrentUser() requester: User): Promise<WrappedHospitalVisitActivity> {
        return this.activityCrudService.findByVisitId(hospitalVisitId, requester);
    }

    @Get('/:id/related/activities')
    @PermissionGuard(Permission.canReadActivity, Permission.canReadVisit, Permission.canReadChild)
    public async findRelated(@Param('id', ParseUUIDPipe) hospitalVisitId: string,
                             @CurrentUser() requester: User): Promise<Array<WrappedHospitalVisitActivity>> {
        const relatedVisitIds = await this.visitRelationDao.findRelationIds(hospitalVisitId, requester);
        return this.activityCrudService.findByVisitIds(relatedVisitIds, requester);
    }

}
