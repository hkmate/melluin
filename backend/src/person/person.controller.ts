import {
    Body,
    Controller,
    Get, HttpCode,
    HttpStatus,
    Param,
    ParseUUIDPipe,
    Post,
    Put,
    Query
} from '@nestjs/common';
import {PersonCrudService} from '@be/person/person.crud.service';
import {Pageable, PageRequest} from '@shared/api-util/pageable';
import {Person} from '@shared/person/person';
import {User} from '@shared/user/user';
import {CurrentUser} from '@be/auth/decorator/current-user.decorator';
import {Roles} from '@be/auth/decorator/roles.decorator';
import {foundationEmployeeRoles} from '@shared/user/role.enum';
import {PersonCreation} from '@be/person/model/person-creation';
import {PersonUpdate} from '@be/person/model/person-update';
import {PageRequestParserPipe} from '@be/crud/page-request-parser.pipe';


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
    public find(@Query('query', PageRequestParserPipe) pageRequest: PageRequest,
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
