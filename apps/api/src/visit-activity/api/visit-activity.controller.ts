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
import {
    VisitActivity,
    VisitActivityEditInput,
    isNil,
    Permission,
    User,
    WrappedVisitActivity, UUID
} from '@melluin/common';
import {CurrentUser} from '@be/auth/decorator/current-user.decorator';
import {VisitActivityCrudService} from '@be/visit-activity/visit-activity.crud.service';
import {VisitRelationDao} from '@be/visit/visit-relation.dao';
import {PermissionGuard} from '@be/auth/decorator/permissions.decorator';
import {
    VisitActivityEditDto,
    VisitActivityDto
} from '@be/visit-activity/api/dto/visit-activity-input.dto';
import { ApiBearerAuth } from '@nestjs/swagger';


@ApiBearerAuth()
@Controller('visits')
export class VisitActivityController {

    constructor(private readonly activityCrudService: VisitActivityCrudService,
                private readonly visitRelationDao: VisitRelationDao) {
    }

    @Post('/:id/activities')
    @HttpCode(HttpStatus.CREATED)
    @PermissionGuard(Permission.canCreateActivity, Permission.canWriteActivityAtAnyVisit)
    public save(@Param('id', ParseUUIDPipe) visitId: UUID,
                @Body() activityInput: VisitActivityDto,
                @CurrentUser() requester: User): Promise<VisitActivity> {
        activityInput.visitId = visitId;
        return this.activityCrudService.save(activityInput, requester);
    }

    @Put('/:visitId/activities/:id')
    @PermissionGuard(Permission.canCreateActivity, Permission.canWriteActivityAtAnyVisit)
    public update(@Param('visitId', ParseUUIDPipe) visitId: UUID,
                  @Param('id', ParseUUIDPipe) activityId: UUID,
                  @Body() activityInput: VisitActivityEditDto,
                  @CurrentUser() requester: User): Promise<VisitActivity> {
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
    public delete(@Param('visitId', ParseUUIDPipe) visitId: UUID,
                  @Param('id', ParseUUIDPipe) activityId: UUID,
                  @CurrentUser() requester: User): Promise<void> {
        return this.activityCrudService.delete(visitId, activityId, requester);
    }

    @Get('/:id/activities')
    @PermissionGuard(Permission.canReadActivity)
    public find(@Param('id', ParseUUIDPipe) visitId: UUID,
                @CurrentUser() requester: User): Promise<WrappedVisitActivity> {
        return this.activityCrudService.findByVisitId(visitId, requester);
    }

    @Get('/:id/related/activities')
    @PermissionGuard(Permission.canReadActivity, Permission.canReadVisit, Permission.canReadChild)
    public async findRelated(@Param('id', ParseUUIDPipe) visitId: UUID,
                             @CurrentUser() requester: User): Promise<Array<WrappedVisitActivity>> {
        const relatedVisitIds = await this.visitRelationDao.findRelationIds(visitId, requester);
        return this.activityCrudService.findByVisitIds(relatedVisitIds, requester);
    }

    private verifyVisitIdIsCorrect(visitId: UUID, activityInput: VisitActivityEditInput): void {
        if (visitId !== activityInput.visitId) {
            throw new BadRequestException('Visit id is not the same in the object as in the URL');
        }
    }

    private verifyActivityIdIsCorrect(activityId: UUID, activityInput: VisitActivityEditInput): void {
        if (activityId !== activityInput.id) {
            throw new BadRequestException('Activity id is not the same in the object as in the URL');
        }
    }

}
