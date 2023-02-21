import {Body, Controller, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post, Put} from '@nestjs/common';
import {Pageable} from '@shared/api-util/pageable';
import {User} from '@shared/user/user';
import {CurrentUser} from '@be/auth/decorator/current-user.decorator';
import {Roles} from '@be/auth/decorator/roles.decorator';
import {Role} from '@shared/user/role.enum';
import {PageReq} from '@be/crud/page-req';
import {PageRequest} from '@be/crud/page-request';
import {HospitalVisitCrudService} from '@be/hospital-visit/hospital-visit.crud.service';
import {HospitalVisitCreate} from '@shared/hospital-visit/hospital-visit-create';
import {HospitalVisit} from '@shared/hospital-visit/hospital-visit';
import {HospitalVisitRewrite} from '@shared/hospital-visit/hospital-visit-rewrite';


@Controller('hospital-visits')
export class HospitalVisitController {

    constructor(private readonly visitCrudService: HospitalVisitCrudService) {
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @Roles(Role.SYSADMIN, Role.HOSPITAL_VISIT_COORDINATOR)
    public save(@Body() hospitalVisitCreate: HospitalVisitCreate,
                @CurrentUser() requester: User): Promise<HospitalVisit> {
        return this.visitCrudService.save(hospitalVisitCreate, requester);
    }

    @Get('/:id')
    public getOne(@Param('id', ParseUUIDPipe) hospitalVisitId: string): Promise<HospitalVisit> {
        return this.visitCrudService.getOne(hospitalVisitId);
    }

    @Get()
    public find(@PageReq() pageRequest: PageRequest,
                @CurrentUser() requester: User): Promise<Pageable<HospitalVisit>> {
        return this.visitCrudService.find(pageRequest, requester);
    }

    @Put('/:id')
    @Roles(Role.SYSADMIN, Role.HOSPITAL_VISIT_COORDINATOR)
    public update(@Param('id', ParseUUIDPipe) hospitalVisitId: string,
                  @Body() visitRewrite: HospitalVisitRewrite,
                  @CurrentUser() requester: User): Promise<HospitalVisit> {
        return this.visitCrudService.rewrite(hospitalVisitId, visitRewrite, requester);
    }

}
