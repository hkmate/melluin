import {Body, Controller, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post, Put} from '@nestjs/common';
import {PersonCrudService} from '@be/person/person.crud.service';
import {Pageable} from '@shared/api-util/pageable';
import {Person} from '@shared/person/person';
import {User} from '@shared/user/user';
import {CurrentUser} from '@be/auth/decorator/current-user.decorator';
import {PersonCreation} from '@shared/person/person-creation';
import {PersonRewrite} from '@shared/person/person-rewrite';
import {PageReq} from '@be/crud/page-req';
import {PageRequest} from '@be/crud/page-request';
import {PermissionGuard} from '@be/auth/decorator/permissions.decorator';
import {Permission} from '@shared/user/permission.enum';


@Controller('people')
export class PersonController {

    constructor(private readonly personCrudService: PersonCrudService) {
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @PermissionGuard(Permission.canCreatePerson)
    public save(@Body() person: PersonCreation,
                @CurrentUser() requester: User): Promise<Person> {
        return this.personCrudService.save(person, requester);
    }

    @Get('/:id')
    @PermissionGuard(Permission.canReadPerson)
    public getOne(@Param('id', ParseUUIDPipe) personId: string,
                  @CurrentUser() requester: User): Promise<Person> {
        return this.personCrudService.getOne(personId, requester);
    }

    @Get()
    @PermissionGuard(Permission.canReadPerson)
    public find(@PageReq() pageRequest: PageRequest,
                @CurrentUser() requester: User): Promise<Pageable<Person>> {
        return this.personCrudService.find(pageRequest, requester);
    }

    @Put('/:id')
    @PermissionGuard(Permission.canWriteSelf, Permission.canWriteVisitor, Permission.canWriteCoordinator,
        Permission.canWriteAdmin, Permission.canWriteSysAdmin)
    public update(@Param('id', ParseUUIDPipe) personId: string,
                  @Body() personRewrite: PersonRewrite,
                  @CurrentUser() requester: User): Promise<Person> {
        return this.personCrudService.update(personId, personRewrite, requester);
    }

}
