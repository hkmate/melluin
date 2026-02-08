import {Body, Controller, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Patch, Post, Query} from '@nestjs/common';
import {Pageable} from '@shared/api-util/pageable';
import {User} from '@shared/user/user';
import {CurrentUser} from '@be/auth/decorator/current-user.decorator';
import {PageReq} from '@be/crud/page-req';
import {PageRequest} from '@be/crud/page-request';
import {DepartmentCrudService} from '@be/department/department.crud.service';
import {Department} from '@shared/department/department';
import {BoxStatusWithDepartmentBrief, DepartmentBoxStatus} from '@shared/department/box/department-box-status';
import {DepartmentBoxStatusCrudService} from '@be/department-box/department-box-status.crud.service';
import {PermissionGuard} from '@be/auth/decorator/permissions.decorator';
import {Permission} from '@shared/user/permission.enum';
import {BoxStatusInfoParam} from '@be/department-box/constants/box-status-info-param';
import {DepartmentBoxStatusReportValidatedInput} from '@be/department/api/dto/department-box-status-report';
import {DepartmentCreationValidatedInput} from '@be/department/api/dto/department-creation';
import {DepartmentUpdateChangeSetValidatedInput} from '@be/department/api/dto/department-update-change-set';


@Controller('departments')
export class DepartmentController {

    constructor(private readonly departmentCrudService: DepartmentCrudService,
                private readonly boxStatusCrudService: DepartmentBoxStatusCrudService) {
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @PermissionGuard(Permission.canWriteDepartment)
    public save(@Body() department: DepartmentCreationValidatedInput,
                @CurrentUser() requester: User): Promise<Department> {
        return this.departmentCrudService.save(department, requester);
    }

    @Post('/:id/box-status')
    @PermissionGuard(Permission.canWriteDepBox)
    public saveDepartmentBoxStatus(@Param('id', ParseUUIDPipe) departmentId: string,
                                   @Body() boxStatusReport: DepartmentBoxStatusReportValidatedInput,
                                   @CurrentUser() currentUser: User): Promise<DepartmentBoxStatus> {
        return this.boxStatusCrudService.save(departmentId, boxStatusReport, currentUser);
    }

    @Get('/:id')
    @PermissionGuard(Permission.canReadDepartment)
    public getOne(@Param('id', ParseUUIDPipe) departmentId: string): Promise<Department> {
        return this.departmentCrudService.getOne(departmentId);
    }

    @Get()
    @PermissionGuard(Permission.canSearchDepartment)
    public find(@PageReq() pageRequest: PageRequest,
                @CurrentUser() requester: User): Promise<Pageable<Department>> {
        return this.departmentCrudService.find(pageRequest, requester);
    }

    @Get('/:id/box-status')
    @PermissionGuard(Permission.canReadDepBox)
    public findBoxStatuses(@Param('id', ParseUUIDPipe) departmentId: string,
                           @Query('withDepartmentBrief') withDepartmentBrief: boolean,
                           @PageReq() pageRequest: PageRequest): Promise<Pageable<DepartmentBoxStatus> | Pageable<BoxStatusWithDepartmentBrief>> {
        const infoParam = withDepartmentBrief ? BoxStatusInfoParam.WITH_DEPARTMENT_BRIEF : BoxStatusInfoParam.PURE_BOX_STATUS;
        return this.boxStatusCrudService.findByDepartment(departmentId, pageRequest, infoParam);
    }

    @Patch('/:id')
    @PermissionGuard(Permission.canWriteDepartment)
    public update(@Param('id', ParseUUIDPipe) departmentId: string,
                  @Body() updateChangeSet: DepartmentUpdateChangeSetValidatedInput,
                  @CurrentUser() requester: User): Promise<Department> {
        return this.departmentCrudService.update(departmentId, updateChangeSet, requester);
    }

}
