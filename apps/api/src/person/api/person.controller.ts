import {
    Body,
    Controller,
    DefaultValuePipe,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseBoolPipe,
    ParseUUIDPipe,
    Post,
    Put,
    Query
} from '@nestjs/common';
import {PersonCrudService} from '@be/person/person.crud.service';
import {Pageable, Permission, Person, PersonIdentifier, User, UUID} from '@melluin/common';
import {CurrentUser} from '@be/auth/decorator/current-user.decorator';
import {PageReq} from '@be/crud/page-req';
import {PageRequest} from '@be/crud/page-request';
import {PermissionGuard} from '@be/auth/decorator/permissions.decorator';
import {PersonCreationDto} from '@be/person/api/dto/person-creation.dto';
import {PersonRewriteDto} from '@be/person/api/dto/person-rewrite.dto';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('people')
export class PersonController {

    constructor(private readonly personCrudService: PersonCrudService) {
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @PermissionGuard(Permission.canCreatePerson)
    public save(@Body() person: PersonCreationDto,
                @CurrentUser() requester: User): Promise<Person> {
        return this.personCrudService.save(person, requester);
    }

    @Get('/:id')
    @PermissionGuard(Permission.canReadPerson)
    public getOne(@Param('id', ParseUUIDPipe) personId: UUID,
                  @CurrentUser() requester: User): Promise<Person> {
        return this.personCrudService.getOne(personId, requester);
    }

    public find(pageRequest: PageRequest, onlyIdentifier: false, requester: User): Promise<Pageable<Person>>;
    public find(pageRequest: PageRequest, onlyIdentifier: true, requester: User): Promise<Pageable<PersonIdentifier>>;
    @Post('\\:list')
    @HttpCode(HttpStatus.OK)
    @PermissionGuard(Permission.canReadPerson)
    @ApiQuery({name: 'onlyIdentifier', required: false, default: false})
    public find(@PageReq() pageRequest: PageRequest,
                @Query('onlyIdentifier', new DefaultValuePipe(false), ParseBoolPipe) onlyIdentifier: boolean,
                @CurrentUser() requester: User): Promise<Pageable<Person> | Pageable<PersonIdentifier>> {
        if (onlyIdentifier) {
            return this.personCrudService.findIdentifiers(pageRequest, requester);
        }
        return this.personCrudService.find(pageRequest, requester);
    }

    @Put('/:id')
    @PermissionGuard(Permission.canWriteSelf, Permission.canWriteVisitor, Permission.canWriteCoordinator,
        Permission.canWriteAdmin, Permission.canWriteSysAdmin)
    public update(@Param('id', ParseUUIDPipe) personId: UUID,
                  @Body() personRewrite: PersonRewriteDto,
                  @CurrentUser() requester: User): Promise<Person> {
        return this.personCrudService.update(personId, personRewrite, requester);
    }

}
