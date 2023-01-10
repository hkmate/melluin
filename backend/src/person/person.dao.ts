import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {PersonEntity} from './model/person.entity';
import {PageCreator} from '@be/pageable/page-creator';
import {Pageable, PageRequest} from '@shared/api-util/pageable';
import {WhereClosureConverter} from '@be/find-option-converter/where-closure.converter';

@Injectable()
export class PersonDao extends PageCreator<PersonEntity> {

    constructor(@InjectRepository(PersonEntity) repository: Repository<PersonEntity>,
                whereClosureConverter: WhereClosureConverter) {
        super(repository, whereClosureConverter);
    }

    public save(person: PersonEntity): Promise<PersonEntity> {
        return this.repository.save(person);
    }

    public findAll(pageRequest: PageRequest<PersonEntity>): Promise<Pageable<PersonEntity>> {
        return this.getPage(pageRequest, {relations: {user: true}});
    }

}
