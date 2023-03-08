import {Body, Controller, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Patch, Post} from '@nestjs/common';
import {Pageable} from '@shared/api-util/pageable';
import {User} from '@shared/user/user';
import {CurrentUser} from '@be/auth/decorator/current-user.decorator';
import {PageReq} from '@be/crud/page-req';
import {PageRequest} from '@be/crud/page-request';
import {DepartmentCrudService} from '@be/department/department.crud.service';
import {DepartmentCreation} from '@shared/department/department-creation';
import {Department} from '@shared/department/department';
import {DepartmentUpdateChangeSet} from '@shared/department/department-update-change-set';
import {DepartmentBoxStatus} from '@shared/department/box/department-box-status';
import {DepartmentBoxStatusReport} from '@shared/department/box/department-box-status-report';
import {DepartmentBoxStatusCrudService} from '@be/department-box/department-box-status.crud.service';
import {PermissionGuard} from '@be/auth/decorator/permissions.decorator';
import {Permission} from '@shared/user/permission.enum';


@Controller('departments')
export class DepartmentController {

    constructor(private readonly departmentCrudService: DepartmentCrudService,
                private readonly boxStatusCrudService: DepartmentBoxStatusCrudService) {
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @PermissionGuard(Permission.canWriteDepartment)
    public save(@Body() department: DepartmentCreation,
                @CurrentUser() requester: User): Promise<Department> {
        return this.departmentCrudService.save(department, requester);
    }

    @Post('/:id/box-status')
    @PermissionGuard(Permission.canWriteDepBox)
    public saveDepartmentBoxStatus(@Param('id', ParseUUIDPipe) departmentId: string,
                                   @Body() boxStatusReport: DepartmentBoxStatusReport,
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
                           @PageReq() pageRequest: PageRequest,
                           @CurrentUser() requester: User): Promise<Pageable<DepartmentBoxStatus>> {
        return this.boxStatusCrudService.find(departmentId, pageRequest, requester);
    }

    @Patch('/:id')
    @PermissionGuard(Permission.canWriteDepartment)
    public update(@Param('id', ParseUUIDPipe) departmentId: string,
                  @Body() updateChangeSet: DepartmentUpdateChangeSet,
                  @CurrentUser() requester: User): Promise<Department> {
        return this.departmentCrudService.update(departmentId, updateChangeSet, requester);
    }

}
