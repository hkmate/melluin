import {Body, Controller, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post, Put} from '@nestjs/common';
import {User} from '@shared/user/user';
import {CurrentUser} from '@be/auth/decorator/current-user.decorator';
import {ChildCrudService} from '@be/child/child.crud.service';
import {ChildInput} from '@shared/child/child-input';
import {Child} from '@shared/child/child';


@Controller('children')
export class ChildController {

    constructor(private readonly childCrudService: ChildCrudService) {
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    public save(@Body() childInput: ChildInput,
                @CurrentUser() requester: User): Promise<Child> {
        return this.childCrudService.save(childInput, requester);
    }

    @Get('/:id')
    public getOne(@Param('id', ParseUUIDPipe) childId: string): Promise<Child> {
        return this.childCrudService.getOne(childId);
    }

    @Put('/:id')
    public update(@Param('id', ParseUUIDPipe) childId: string,
                  @Body() childRewrite: ChildInput,
                  @CurrentUser() requester: User): Promise<Child> {
        return this.childCrudService.rewrite(childId, childRewrite, requester);
    }

}
