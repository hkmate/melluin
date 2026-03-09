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
import {PermissionGuard} from '@be/auth/decorator/permissions.decorator';
import {Permission, User, UUID, VisitedChild} from '@melluin/common';
import {VisitedChildrenService} from '@be/visit-children/service/visited-children.service';
import {CurrentUser} from '@be/auth/decorator/current-user.decorator';
import {VisitedChildSaverService} from '@be/visit-children/service/visited-child-saver.service';
import {
    VisitedChildEditInputDto,
    VisitedChildInputDto
} from '@be/visit-children/api/dto/visited-child.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('visits')
export class VisitedChildrenController {

    constructor(private readonly visitedChildSaverService: VisitedChildSaverService,
                private readonly visitedChildrenService: VisitedChildrenService) {
    }

    @Post('/:visitId/children')
    @HttpCode(HttpStatus.CREATED)
    @PermissionGuard(Permission.canWriteChild, Permission.canWriteChildAtAnyVisit)
    public addVisitedChild(@Param('visitId', ParseUUIDPipe) visitId: UUID,
                           @Body() childInput: VisitedChildInputDto,
                           @CurrentUser() requester: User): Promise<VisitedChild> {
        return this.visitedChildSaverService.save(visitId, childInput, requester);
    }

    @Get('/:visitId/children')
    @PermissionGuard(Permission.canReadVisit, Permission.canReadChild)
    public getVisitedChildren(@Param('visitId', ParseUUIDPipe) visitId: UUID)
        : Promise<Array<VisitedChild>> {
        return this.visitedChildrenService.findAll(visitId);
    }

    @Put('/:visitId/children/:visitedChildId')
    @PermissionGuard(Permission.canWriteChild, Permission.canWriteChildAtAnyVisit)
    public update(@Param('visitId', ParseUUIDPipe) visitId: UUID,
                  @Param('visitedChildId', ParseUUIDPipe) visitedChildId: UUID,
                  @Body() childInput: VisitedChildEditInputDto,
                  @CurrentUser() requester: User): Promise<VisitedChild> {
        this.verifyVisitChildIdIsCorrect(childInput, visitedChildId);
        return this.visitedChildSaverService.update(visitId, childInput, requester);
    }

    @Delete('/:visitId/children/:visitedChildId')
    @HttpCode(HttpStatus.NO_CONTENT)
    @PermissionGuard(Permission.canModifyVisit, Permission.canWriteChildAtAnyVisit)
    public delete(@Param('visitId', ParseUUIDPipe) visitId: UUID,
                  @Param('visitedChildId', ParseUUIDPipe) visitedChildId: UUID,
                  @CurrentUser() requester: User): Promise<void> {
        return this.visitedChildrenService.remove(visitId, visitedChildId, requester);
    }

    private verifyVisitChildIdIsCorrect(visitedChildInput: VisitedChildEditInputDto, visitedChildId: UUID): void {
        if (visitedChildInput.id !== visitedChildId) {
            throw new BadRequestException('VisitedChildId is not the same as one in the url.');
        }
    }

}
