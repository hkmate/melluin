import {Controller, Get, Query} from '@nestjs/common';
import {Pageable} from '@shared/api-util/pageable';
import {PageReq} from '@be/crud/page-req';
import {PageRequest} from '@be/crud/page-request';
import {BoxStatusWithDepartmentBrief, DepartmentBoxStatus} from '@shared/department/box/department-box-status';
import {DepartmentBoxStatusCrudService} from '@be/department-box/department-box-status.crud.service';
import {PermissionGuard} from '@be/auth/decorator/permissions.decorator';
import {Permission} from '@shared/user/permission.enum';
import {BoxStatusInfoParam} from '@be/department-box/constants/box-status-info-param';


@Controller('departments-box-status')
export class DepartmentBoxStatusController {

    constructor(private readonly boxStatusCrudService: DepartmentBoxStatusCrudService) {
    }

    @Get('')
    @PermissionGuard(Permission.canReadDepBox)
    public findBoxStatuses(@PageReq() pageRequest: PageRequest,
                           @Query('withDepartmentBrief') withDepartmentBrief: boolean): Promise<Pageable<DepartmentBoxStatus> | Pageable<BoxStatusWithDepartmentBrief>> {
        const infoParam = withDepartmentBrief ? BoxStatusInfoParam.WITH_DEPARTMENT_BRIEF : BoxStatusInfoParam.PURE_BOX_STATUS;
        return this.boxStatusCrudService.findAll(pageRequest, infoParam);
    }

}
