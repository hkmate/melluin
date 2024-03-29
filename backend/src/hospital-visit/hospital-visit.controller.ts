import {Body, Controller, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post, Put, Query} from '@nestjs/common';
import {Pageable} from '@shared/api-util/pageable';
import {User} from '@shared/user/user';
import {CurrentUser} from '@be/auth/decorator/current-user.decorator';
import {PageReq} from '@be/crud/page-req';
import {PageRequest} from '@be/crud/page-request';
import {HospitalVisitCrudService} from '@be/hospital-visit/hospital-visit.crud.service';
import {HospitalVisitCreate} from '@shared/hospital-visit/hospital-visit-create';
import {HospitalVisit} from '@shared/hospital-visit/hospital-visit';
import {HospitalVisitRewrite} from '@shared/hospital-visit/hospital-visit-rewrite';
import {PermissionGuard} from '@be/auth/decorator/permissions.decorator';
import {Permission} from '@shared/user/permission.enum';
import {DepartmentBoxStatusCrudService} from '@be/department-box/department-box-status.crud.service';
import {BoxStatusWithDepartmentBrief, DepartmentBoxStatus} from '@shared/department/box/department-box-status';
import {BoxStatusInfoParam} from '@be/department-box/constants/box-status-info-param';


@Controller('hospital-visits')
export class HospitalVisitController {

    constructor(private readonly visitCrudService: HospitalVisitCrudService,
                private readonly boxStatusCrudService: DepartmentBoxStatusCrudService) {
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @PermissionGuard(Permission.canCreateVisit)
    public save(@Body() hospitalVisitCreate: HospitalVisitCreate,
                @CurrentUser() requester: User): Promise<HospitalVisit> {
        return this.visitCrudService.save(hospitalVisitCreate, requester);
    }

    @Get('/:id')
    @PermissionGuard(Permission.canReadVisit)
    public getOne(@Param('id', ParseUUIDPipe) hospitalVisitId: string): Promise<HospitalVisit> {
        return this.visitCrudService.getOne(hospitalVisitId);
    }

    @Get('/:id/box-status')
    @PermissionGuard(Permission.canReadDepBox)
    public getBoxStatusesOfVisit(@Param('id', ParseUUIDPipe) hospitalVisitId: string,
                                 @Query('withDepartmentBrief') withDepartmentBrief: boolean): Promise<Array<DepartmentBoxStatus> | Array<BoxStatusWithDepartmentBrief>> {
        const infoParam = withDepartmentBrief ? BoxStatusInfoParam.WITH_DEPARTMENT_BRIEF : BoxStatusInfoParam.PURE_BOX_STATUS;
        return this.boxStatusCrudService.findByVisit(hospitalVisitId, infoParam);
    }

    /**
     * @param pageRequest In where closure on participants.id the only available operator is the 'in'
     * @param requester
     */
    @Get()
    @PermissionGuard(Permission.canReadVisit)
    public find(@PageReq() pageRequest: PageRequest,
                @CurrentUser() requester: User): Promise<Pageable<HospitalVisit>> {
        return this.visitCrudService.find(pageRequest, requester);
    }

    @Put('/:id')
    @PermissionGuard(Permission.canModifyVisit)
    public update(@Param('id', ParseUUIDPipe) hospitalVisitId: string,
                  @Body() visitRewrite: HospitalVisitRewrite,
                  @CurrentUser() requester: User): Promise<HospitalVisit> {
        return this.visitCrudService.rewrite(hospitalVisitId, visitRewrite, requester);
    }

}
