import {Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post} from '@nestjs/common';
import {HospitalVisit, Permission, User} from '@melluin/common';
import {CurrentUser} from '@be/auth/decorator/current-user.decorator';
import {PermissionGuard} from '@be/auth/decorator/permissions.decorator';
import {HospitalVisitConnectionsService} from '@be/hospital-visit-connections/hospital-visit-connections.service';
import { ApiBearerAuth } from '@nestjs/swagger';


@ApiBearerAuth()
@Controller('hospital-visits')
export class HospitalVisitConnectionsController {

    constructor(private readonly connectionsService: HospitalVisitConnectionsService) {
    }

    @Post('/:visitId/connections/:connectId')
    @HttpCode(HttpStatus.CREATED)
    @PermissionGuard(Permission.canWriteVisitConnections)
    public addConnection(@Param('visitId', ParseUUIDPipe) visitId: string,
                         @Param('connectId', ParseUUIDPipe) connectId: string,
                         @CurrentUser() requester: User): Promise<void> {
        return this.connectionsService.addConnection(visitId, connectId, requester);
    }

    @Get('/:visitId/connections')
    @PermissionGuard(Permission.canReadVisitConnections)
    public getConnections(@Param('visitId', ParseUUIDPipe) visitId: string,
                          @CurrentUser() requester: User): Promise<Array<HospitalVisit>> {
        return this.connectionsService.getConnections(visitId, requester);
    }

    @Delete('/:visitId/connections/:connectId')
    @HttpCode(HttpStatus.NO_CONTENT)
    @PermissionGuard(Permission.canWriteVisitConnections)
    public deleteConnection(@Param('visitId', ParseUUIDPipe) visitId: string,
                            @Param('connectId', ParseUUIDPipe) connectId: string,
                            @CurrentUser() requester: User): Promise<void> {
        return this.connectionsService.deleteConnection(visitId, connectId, requester);
    }

}
