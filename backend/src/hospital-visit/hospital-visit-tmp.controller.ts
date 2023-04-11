import {Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post} from '@nestjs/common';
import {PermissionGuard} from '@be/auth/decorator/permissions.decorator';
import {Permission} from '@shared/user/permission.enum';
import {HospitalVisitTempDataService} from '@be/hospital-visit/hospital-visit-temp-data.service';
import {VisitTmpData} from '@shared/hospital-visit/visit-tmp-data';


@Controller('hospital-visits')
export class HospitalVisitTmpController {

    constructor(private readonly visitTempDataService: HospitalVisitTempDataService) {
    }

    @Get('/:id/tmp')
    @PermissionGuard(Permission.canReadVisit)
    public getTempData(@Param('id', ParseUUIDPipe) hospitalVisitId: string): Promise<Record<string, unknown>> {
        return this.visitTempDataService.findAll(hospitalVisitId);
    }

    @Post('/:id/tmp/:key')
    @PermissionGuard(Permission.canModifyVisit)
    public update(@Param('id', ParseUUIDPipe) hospitalVisitId: string,
                  @Param('key') tmpKey: string,
                  @Body() tmpValue: VisitTmpData): Promise<unknown> {
        return this.visitTempDataService.save(hospitalVisitId, tmpKey, tmpValue.value);
    }

    @Delete('/:id/tmp')
    @PermissionGuard(Permission.canModifyVisit)
    public delete(@Param('id', ParseUUIDPipe) hospitalVisitId: string): Promise<void> {
        return this.visitTempDataService.removeAll(hospitalVisitId);
    }

}
