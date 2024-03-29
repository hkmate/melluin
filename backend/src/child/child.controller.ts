import {Body, Controller, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post, Put} from '@nestjs/common';
import {User} from '@shared/user/user';
import {CurrentUser} from '@be/auth/decorator/current-user.decorator';
import {ChildCrudService} from '@be/child/child.crud.service';
import {ChildInput} from '@shared/child/child-input';
import {Child} from '@shared/child/child';
import {PermissionGuard} from '@be/auth/decorator/permissions.decorator';
import {Permission} from '@shared/user/permission.enum';


@Controller('children')
export class ChildController {

    constructor(private readonly childCrudService: ChildCrudService) {
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @PermissionGuard(Permission.canWriteChild)
    public save(@Body() childInput: ChildInput,
                @CurrentUser() requester: User): Promise<Child> {
        return this.childCrudService.save(childInput, requester);
    }

    @Get('/:id')
    @PermissionGuard(Permission.canReadChild)
    public getOne(@Param('id', ParseUUIDPipe) childId: string): Promise<Child> {
        return this.childCrudService.getOne(childId);
    }

    @Put('/:id')
    @PermissionGuard(Permission.canWriteChild)
    public update(@Param('id', ParseUUIDPipe) childId: string,
                  @Body() childRewrite: ChildInput,
                  @CurrentUser() requester: User): Promise<Child> {
        return this.childCrudService.rewrite(childId, childRewrite, requester);
    }

}
