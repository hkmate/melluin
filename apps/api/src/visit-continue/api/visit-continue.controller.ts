import {BadRequestException, Controller, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post, Query} from '@nestjs/common';
import {ApiError, Visit, Permission, User, UUID} from '@melluin/common';
import {CurrentUser} from '@be/auth/decorator/current-user.decorator';
import {PermissionGuard} from '@be/auth/decorator/permissions.decorator';
import {VisitContinueService} from '@be/visit-continue/visit-continue.service';
import dayjs from 'dayjs';
import { ApiBearerAuth } from '@nestjs/swagger';


@ApiBearerAuth()
@Controller('visits')
export class VisitContinueController {

    constructor(private readonly continueService: VisitContinueService) {
    }

    @Post('/:visitId/continue')
    @HttpCode(HttpStatus.CREATED)
    @PermissionGuard(Permission.canCreateVisit, Permission.canCreateAnyVisit)
    public async addConnection(@Param('visitId', ParseUUIDPipe) visitId: UUID,
                               @Query('from') dateTimeFrom: string,
                               @Query('departmentId', ParseUUIDPipe) departmentId: UUID,
                               @CurrentUser() requester: User): Promise<Visit> {
        this.verifyItIsValidDateTime(dateTimeFrom);
        return await this.continueService.createConnectedVisit(visitId, dateTimeFrom, departmentId, requester);
    }

    private verifyItIsValidDateTime(dateTime: string): void | never {
        if (!dayjs(dateTime).isValid()) {
            throw new BadRequestException({
                message: `Invalid date time: ${dateTime}`,
                code: ApiError.INVALID_DATE_TIME
            });
        }
    }

}
