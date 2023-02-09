import {
    Body,
    Controller,
    Get, HttpCode,
    HttpStatus,
    Param,
    ParseUUIDPipe,
    Post,
    Put
} from '@nestjs/common';
import {PersonCrudService} from '@be/person/person.crud.service';
import {Pageable} from '@shared/api-util/pageable';
import {Person} from '@shared/person/person';
import {User} from '@shared/user/user';
import {CurrentUser} from '@be/auth/decorator/current-user.decorator';
import {Roles} from '@be/auth/decorator/roles.decorator';
import {foundationEmployeeRoles} from '@shared/user/role.enum';
import {PersonCreation} from '@shared/person/person-creation';
import {PersonUpdate} from '@shared/person/person-update';
import {PageReq} from '@be/crud/page-req';
import {PageRequest} from '@be/crud/page-request';


@Controller('people')
export class PersonController {

    constructor(private readonly personCrudService: PersonCrudService) {
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @Roles(...foundationEmployeeRoles)
    public save(@Body() person: PersonCreation,
                @CurrentUser() requester: User): Promise<Person> {
        return this.personCrudService.save(person, requester);
    }

    @Get('/:id')
    public getOne(@Param('id', ParseUUIDPipe) personId: string): Promise<Person> {
        return this.personCrudService.getOne(personId);
    }

    @Get()
    @Roles(...foundationEmployeeRoles)
    public find(@PageReq() pageRequest: PageRequest,
                @CurrentUser() requester: User): Promise<Pageable<Person>> {
        return this.personCrudService.find(pageRequest, requester);
    }

    @Put('/:id')
    public update(@Param('id', ParseUUIDPipe) personId: string,
                  @Body() updateChangeSet: PersonUpdate,
                  @CurrentUser() requester: User): Promise<Person> {
        return this.personCrudService.update(personId, updateChangeSet, requester);
    }

}
