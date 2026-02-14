import {BadRequestException, Controller, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post, Query} from '@nestjs/common';
import {User} from '@shared/user/user';
import {CurrentUser} from '@be/auth/decorator/current-user.decorator';
import {PermissionGuard} from '@be/auth/decorator/permissions.decorator';
import {Permission} from '@shared/user/permission.enum';
import {HospitalVisitContinueService} from '@be/hospital-visit-continue/hospital-visit-continue.service';
import dayjs from 'dayjs';
import {ApiError} from '@shared/api-util/api-error';
import {HospitalVisit} from '@shared/hospital-visit/hospital-visit';


@Controller('hospital-visits')
export class HospitalVisitContinueController {

    constructor(private readonly continueService: HospitalVisitContinueService) {
    }

    @Post('/:visitId/continue')
    @HttpCode(HttpStatus.CREATED)
    @PermissionGuard(Permission.canCreateVisit, Permission.canCreateAnyVisit)
    public async addConnection(@Param('visitId', ParseUUIDPipe) visitId: string,
                               @Query('from') dateTimeFrom: string,
                               @Query('departmentId', ParseUUIDPipe) departmentId: string,
                               @CurrentUser() requester: User): Promise<HospitalVisit> {
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
