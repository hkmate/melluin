import {Body, Controller, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Patch, Post} from '@nestjs/common';
import {Pageable} from '@shared/api-util/pageable';
import {User} from '@shared/user/user';
import {CurrentUser} from '@be/auth/decorator/current-user.decorator';
import {Roles} from '@be/auth/decorator/roles.decorator';
import {Role} from '@shared/user/role.enum';
import {PageReq} from '@be/crud/page-req';
import {PageRequest} from '@be/crud/page-request';
import {DepartmentCrudService} from '@be/department/department.crud.service';
import {DepartmentCreation} from '@shared/department/department-creation';
import {Department} from '@shared/department/department';
import {DepartmentUpdateChangeSet} from '@shared/department/department-update-change-set';


@Controller('departments')
export class DepartmentController {

    constructor(private readonly departmentCrudService: DepartmentCrudService) {
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @Roles(Role.SYSADMIN, Role.ADMINISTRATOR, Role.HOSPITAL_VISIT_COORDINATOR)
    public save(@Body() department: DepartmentCreation,
                @CurrentUser() requester: User): Promise<Department> {
        return this.departmentCrudService.save(department, requester);
    }

    @Get('/:id')
    public getOne(@Param('id', ParseUUIDPipe) departmentId: string): Promise<Department> {
        return this.departmentCrudService.getOne(departmentId);
    }

    @Get()
    @Roles(Role.SYSADMIN, Role.ADMINISTRATOR, Role.HOSPITAL_VISIT_COORDINATOR)
    public find(@PageReq() pageRequest: PageRequest,
                @CurrentUser() requester: User): Promise<Pageable<Department>> {
        return this.departmentCrudService.find(pageRequest, requester);
    }

    @Patch('/:id')
    public update(@Param('id', ParseUUIDPipe) departmentId: string,
                  @Body() updateChangeSet: DepartmentUpdateChangeSet,
                  @CurrentUser() requester: User): Promise<Department> {
        return this.departmentCrudService.update(departmentId, updateChangeSet, requester);
    }

}
