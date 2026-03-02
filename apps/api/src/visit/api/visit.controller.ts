import {
    BadRequestException,
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
import {
    BoxStatusWithDepartmentBrief,
    DepartmentBoxStatus,
    Visit,
    Pageable,
    Permission,
    User
} from '@melluin/common';
import {CurrentUser} from '@be/auth/decorator/current-user.decorator';
import {PageReq} from '@be/crud/page-req';
import {PageRequest} from '@be/crud/page-request';
import {VisitCrudService} from '@be/visit/visit.crud.service';
import {PermissionGuard} from '@be/auth/decorator/permissions.decorator';
import {DepartmentBoxStatusCrudService} from '@be/department-box/department-box-status.crud.service';
import {BoxStatusInfoParam} from '@be/department-box/constants/box-status-info-param';
import {VisitCreateDto} from '@be/visit/api/dto/visit-create.dto';
import {VisitRewriteDto} from '@be/visit/api/dto/visit-rewrite.dto';
import {ApiBearerAuth, ApiQuery} from '@nestjs/swagger';


@ApiBearerAuth()
@Controller('visits')
export class VisitController {

    constructor(private readonly visitCrudService: VisitCrudService,
                private readonly boxStatusCrudService: DepartmentBoxStatusCrudService) {
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @PermissionGuard(Permission.canCreateVisit, Permission.canCreateAnyVisit)
    @ApiQuery({name: 'forceSameTime', required: false, default: false})
    public save(@Query('forceSameTime', new DefaultValuePipe(false), ParseBoolPipe) sameTimeVisitForced: boolean,
                @Body() visitCreate: VisitCreateDto,
                @CurrentUser() requester: User): Promise<Visit> {
        return this.visitCrudService.save(visitCreate, sameTimeVisitForced, requester);
    }

    @Get('/:id')
    @PermissionGuard(Permission.canReadVisit)
    public getOne(@Param('id', ParseUUIDPipe) visitId: string): Promise<Visit> {
        return this.visitCrudService.getOne(visitId);
    }

    @Get('/:id/box-status')
    @PermissionGuard(Permission.canReadDepBox)
    public getBoxStatusesOfVisit(@Param('id', ParseUUIDPipe) visitId: string,
                                 @Query('withDepartmentBrief') withDepartmentBrief: boolean): Promise<Array<DepartmentBoxStatus> | Array<BoxStatusWithDepartmentBrief>> {
        const infoParam = withDepartmentBrief ? BoxStatusInfoParam.WITH_DEPARTMENT_BRIEF : BoxStatusInfoParam.PURE_BOX_STATUS;
        return this.boxStatusCrudService.findByVisit(visitId, infoParam);
    }

    /**
     * @param pageRequest In where closure on participants.id the only available operator is the 'in'
     * @param requester
     */
    @Post('\\:list')
    @HttpCode(HttpStatus.OK)
    @PermissionGuard(Permission.canReadVisit)
    public find(@PageReq() pageRequest: PageRequest,
                @CurrentUser() requester: User): Promise<Pageable<Visit>> {
        return this.visitCrudService.find(pageRequest, requester);
    }

    @Put('/:id')
    @PermissionGuard(Permission.canModifyVisit, Permission.canModifyAnyVisit)
    @ApiQuery({name: 'forceSameTime', required: false, default: false})
    public update(@Param('id', ParseUUIDPipe) visitId: string,
                  @Query('forceSameTime', new DefaultValuePipe(false), ParseBoolPipe) sameTimeVisitForced: boolean,
                  @Body() visitRewrite: VisitRewriteDto,
                  @CurrentUser() requester: User): Promise<Visit> {
        this.verifyIsCorrect(visitId, visitRewrite);
        return this.visitCrudService.rewrite(visitId, visitRewrite, sameTimeVisitForced, requester);
    }

    private verifyIsCorrect(id: string, dto: {id: string}): void {
        if (id !== dto.id) {
            throw new BadRequestException('Path id is not the same in the object as in the URL');
        }
    }

}
