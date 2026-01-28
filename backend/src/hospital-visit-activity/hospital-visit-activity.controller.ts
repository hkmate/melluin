import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseUUIDPipe,
    Post,
    Put
} from '@nestjs/common';
import {User} from '@shared/user/user';
import {CurrentUser} from '@be/auth/decorator/current-user.decorator';
import {
    HospitalVisitActivityEditInput,
    HospitalVisitActivityInput
} from '@shared/hospital-visit-activity/hospital-visit-activity-input';
import {HospitalVisitActivityCrudService} from '@be/hospital-visit-activity/hospital-visit-activity.crud.service';
import {HospitalVisitActivity} from '@shared/hospital-visit-activity/hospital-visit-activity';
import {WrappedHospitalVisitActivity} from '@shared/hospital-visit-activity/wrapped-hospital-visit-activity';
import {HospitalVisitRelationDao} from '@be/hospital-visit/hospital-visit-relation.dao';
import {PermissionGuard} from '@be/auth/decorator/permissions.decorator';
import {Permission} from '@shared/user/permission.enum';
import {isNil} from '@shared/util/util';


@Controller('hospital-visits')
export class HospitalVisitActivityController {

    constructor(private readonly activityCrudService: HospitalVisitActivityCrudService,
                private readonly visitRelationDao: HospitalVisitRelationDao) {
    }

    @Post('/:id/activities')
    @HttpCode(HttpStatus.CREATED)
    @PermissionGuard(Permission.canCreateActivity, Permission.canWriteActivityAtAnyVisit)
    public save(@Param('id', ParseUUIDPipe) hospitalVisitId: string,
                @Body() activityInput: HospitalVisitActivityInput,
                @CurrentUser() requester: User): Promise<HospitalVisitActivity> {
        activityInput.visitId = hospitalVisitId;
        return this.activityCrudService.save(activityInput, requester);
    }

    @Put('/:visitId/activities/:id')
    @PermissionGuard(Permission.canCreateActivity, Permission.canWriteActivityAtAnyVisit)
    public update(@Param('visitId', ParseUUIDPipe) visitId: string,
                  @Param('id', ParseUUIDPipe) activityId: string,
                  @Body() activityInput: HospitalVisitActivityEditInput,
                  @CurrentUser() requester: User): Promise<HospitalVisitActivity> {
        if (isNil(activityInput.visitId)) {
            activityInput.visitId = visitId;
        }
        this.verifyVisitIdIsCorrect(visitId, activityInput);
        this.verifyActivityIdIsCorrect(activityId, activityInput);
        return this.activityCrudService.update(activityInput, requester);
    }

    @Delete('/:visitId/activities/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @PermissionGuard(Permission.canCreateActivity, Permission.canWriteActivityAtAnyVisit)
    public delete(@Param('visitId', ParseUUIDPipe) visitId: string,
                  @Param('id', ParseUUIDPipe) activityId: string,
                  @CurrentUser() requester: User): Promise<void> {
        return this.activityCrudService.delete(visitId, activityId, requester);
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

    private verifyVisitIdIsCorrect(visitId: string, activityInput: HospitalVisitActivityEditInput): void {
        if (visitId !== activityInput.visitId) {
            throw new BadRequestException('Visit id is not the same in the object as in the URL');
        }
    }

    private verifyActivityIdIsCorrect(activityId: string, activityInput: HospitalVisitActivityEditInput): void {
        if (activityId !== activityInput.id) {
            throw new BadRequestException('Activity id is not the same in the object as in the URL');
        }
    }

}
