import {Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post} from '@nestjs/common';
import {PermissionGuard} from '@be/auth/decorator/permissions.decorator';
import {Permission} from '@shared/user/permission.enum';
import {VisitedChild, VisitedChildInput} from '@shared/hospital-visit/visited-child';
import {VisitedChildrenService} from '@be/hospital-visit-children/service/visited-children.service';
import {VisitedChildEntity} from '@be/hospital-visit-children/persistence/model/visited-child.entity';
import {CurrentUser} from '@be/auth/decorator/current-user.decorator';
import {User} from '@shared/user/user';
import {VisitedChildSaverService} from '@be/hospital-visit-children/service/visited-child-saver.service';


@Controller('hospital-visits')
export class VisitedChildrenController {

    constructor(private readonly visitedChildSaverService: VisitedChildSaverService,
                private readonly visitedChildrenService: VisitedChildrenService) {
    }

    @Post('/:hospitalVisitId/children')
    @HttpCode(HttpStatus.CREATED)
    @PermissionGuard(Permission.canModifyVisit, Permission.canWriteChild)
    public addVisitedChild(@Param('hospitalVisitId', ParseUUIDPipe) hospitalVisitId: string,
                                 @Body() childInput: VisitedChildInput,
                                 @CurrentUser() requester: User): Promise<VisitedChild> {
        return this.visitedChildSaverService.save(hospitalVisitId, childInput, requester);
    }

    @Get('/:hospitalVisitId/children')
    @PermissionGuard(Permission.canReadVisit, Permission.canReadChild)
    public getVisitedChildren(@Param('hospitalVisitId', ParseUUIDPipe) hospitalVisitId: string)
        : Promise<Array<VisitedChildEntity>> {
        return this.visitedChildrenService.findAll(hospitalVisitId);
    }

    @Delete('/:hospitalVisitId/children/:visitedChildId')
    @HttpCode(HttpStatus.NO_CONTENT)
    @PermissionGuard(Permission.canModifyVisit)
    public delete(@Param('hospitalVisitId', ParseUUIDPipe) hospitalVisitId: string,
                  @Param('visitedChildId', ParseUUIDPipe) visitedChildId: string): Promise<void> {
        return this.visitedChildrenService.remove(hospitalVisitId, visitedChildId);
    }

}
