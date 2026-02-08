import {
    Body,
    Controller,
    DefaultValuePipe,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseBoolPipe,
    ParseUUIDPipe,
    Post,
    Put,
    Query
} from '@nestjs/common';
import {Pageable} from '@shared/api-util/pageable';
import {User} from '@shared/user/user';
import {CurrentUser} from '@be/auth/decorator/current-user.decorator';
import {PageReq} from '@be/crud/page-req';
import {PageRequest} from '@be/crud/page-request';
import {HospitalVisitCrudService} from '@be/hospital-visit/hospital-visit.crud.service';
import {HospitalVisit} from '@shared/hospital-visit/hospital-visit';
import {PermissionGuard} from '@be/auth/decorator/permissions.decorator';
import {Permission} from '@shared/user/permission.enum';
import {DepartmentBoxStatusCrudService} from '@be/department-box/department-box-status.crud.service';
import {BoxStatusWithDepartmentBrief, DepartmentBoxStatus} from '@shared/department/box/department-box-status';
import {BoxStatusInfoParam} from '@be/department-box/constants/box-status-info-param';
import {HospitalVisitCreateValidatedInput} from '@be/hospital-visit/api/dto/hospital-visit-create';
import {HospitalVisitRewriteValidatedInput} from '@be/hospital-visit/api/dto/hospital-visit-rewrite';


@Controller('hospital-visits')
export class HospitalVisitController {

    constructor(private readonly visitCrudService: HospitalVisitCrudService,
                private readonly boxStatusCrudService: DepartmentBoxStatusCrudService) {
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @PermissionGuard(Permission.canCreateVisit, Permission.canCreateAnyVisit)
    public save(@Query('forceSameTime', new DefaultValuePipe(false), ParseBoolPipe) sameTimeVisitForced: boolean,
                @Body() hospitalVisitCreate: HospitalVisitCreateValidatedInput,
                @CurrentUser() requester: User): Promise<HospitalVisit> {
        return this.visitCrudService.save(hospitalVisitCreate, sameTimeVisitForced, requester);
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
    @PermissionGuard(Permission.canModifyVisit, Permission.canModifyAnyVisit)
    public update(@Param('id', ParseUUIDPipe) hospitalVisitId: string,
                  @Query('forceSameTime', new DefaultValuePipe(false), ParseBoolPipe) sameTimeVisitForced: boolean,
                  @Body() visitRewrite: HospitalVisitRewriteValidatedInput,
                  @CurrentUser() requester: User): Promise<HospitalVisit> {
        return this.visitCrudService.rewrite(hospitalVisitId, visitRewrite, sameTimeVisitForced, requester);
    }

}
