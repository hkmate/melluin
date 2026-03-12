import {
    BadRequestException,
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseUUIDPipe,
    Post,
    Put,
    Query
} from '@nestjs/common';
import {
    BoxStatusWithDepartmentBrief,
    Department,
    DepartmentBoxStatus,
    Pageable,
    Permission,
    User,
    UUID
} from '@melluin/common';
import {CurrentUser} from '@be/auth/decorator/current-user.decorator';
import {PageReq} from '@be/crud/page-req';
import {PageRequest} from '@be/crud/page-request';
import {DepartmentCrudService} from '@be/department/department.crud.service';
import {DepartmentBoxStatusCrudService} from '@be/department-box/department-box-status.crud.service';
import {PermissionGuard} from '@be/auth/decorator/permissions.decorator';
import {DepartmentBoxStatusReportDto} from '@be/department/api/dto/department-box-status-report.dto';
import {DepartmentCreationDto} from '@be/department/api/dto/department-creation.dto';
import {ApiBearerAuth} from '@nestjs/swagger';
import {DepartmentRewriteDto} from '@be/department/api/dto/department-rewrite.dto';
import {BoxStatusInfoParams} from '@be/department-box/constants/box-status-info-param';


@ApiBearerAuth()
@Controller('departments')
export class DepartmentController {

    constructor(private readonly departmentCrudService: DepartmentCrudService,
                private readonly boxStatusCrudService: DepartmentBoxStatusCrudService) {
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @PermissionGuard(Permission.canWriteDepartment)
    public save(@Body() department: DepartmentCreationDto,
                @CurrentUser() requester: User): Promise<Department> {
        return this.departmentCrudService.save(department, requester);
    }

    @Post('/:id/box-status')
    @PermissionGuard(Permission.canWriteDepBox)
    public saveDepartmentBoxStatus(@Param('id', ParseUUIDPipe) departmentId: UUID,
                                   @Body() boxStatusReport: DepartmentBoxStatusReportDto,
                                   @CurrentUser() currentUser: User): Promise<DepartmentBoxStatus> {
        return this.boxStatusCrudService.save(departmentId, boxStatusReport, currentUser);
    }

    @Get('/:id')
    @PermissionGuard(Permission.canReadDepartment)
    public getOne(@Param('id', ParseUUIDPipe) departmentId: UUID): Promise<Department> {
        return this.departmentCrudService.getOne(departmentId);
    }

    @Post('\\:list')
    @HttpCode(HttpStatus.OK)
    @PermissionGuard(Permission.canSearchDepartment)
    public find(@PageReq() pageRequest: PageRequest,
                @CurrentUser() requester: User): Promise<Pageable<Department>> {
        return this.departmentCrudService.find(pageRequest, requester);
    }

    @Post('/:id/box-status/\\:list')
    @HttpCode(HttpStatus.OK)
    @PermissionGuard(Permission.canReadDepBox)
    public findBoxStatuses(@Param('id', ParseUUIDPipe) departmentId: UUID,
                           @Query('withDepartmentBrief') withDepartmentBrief: boolean,
                           @PageReq() pageRequest: PageRequest): Promise<Pageable<DepartmentBoxStatus> | Pageable<BoxStatusWithDepartmentBrief>> {
        const infoParam = withDepartmentBrief ? BoxStatusInfoParams.WITH_DEPARTMENT_BRIEF : BoxStatusInfoParams.PURE_BOX_STATUS;
        return this.boxStatusCrudService.findByDepartment(departmentId, pageRequest, infoParam);
    }

    @Put('/:id')
    @PermissionGuard(Permission.canWriteDepartment)
    public update(@Param('id', ParseUUIDPipe) departmentId: UUID,
                  @Body() departmentUpdate: DepartmentRewriteDto,
                  @CurrentUser() requester: User): Promise<Department> {
        this.verifyIsCorrect(departmentId, departmentUpdate);
        return this.departmentCrudService.update(departmentUpdate, requester);
    }

    private verifyIsCorrect(id: UUID, dto: { id: UUID }): void {
        if (id !== dto.id) {
            throw new BadRequestException('Path id is not the same in the object as in the URL');
        }
    }

}
