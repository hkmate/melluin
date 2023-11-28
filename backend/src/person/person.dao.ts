import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {In, Repository} from 'typeorm';
import {PersonEntity} from './model/person.entity';
import {Pageable} from '@shared/api-util/pageable';
import {WhereClosureConverter} from '@be/find-option-converter/where-closure.converter';
import {isNil, isNotEmpty} from '@shared/util/util';
import {PageCreator} from '@be/crud/page-creator';
import {PageRequest} from '@be/crud/page-request';
import {FilterOptionsFieldsConverter} from '@be/crud/convert/filter-options-fields-converter';
import {FilterOperation} from '@shared/api-util/filter-options';

@Injectable()
export class PersonDao extends PageCreator<PersonEntity> {

    constructor(@InjectRepository(PersonEntity) repository: Repository<PersonEntity>,
                whereClosureConverter: WhereClosureConverter) {
        super(repository, whereClosureConverter);
    }

    public save(person: PersonEntity): Promise<PersonEntity> {
        return this.repository.save(person);
    }

    public findOne(id: string): Promise<PersonEntity | undefined> {
        return this.repository.findOne({
            where: {id},
            relations: {user: true}
        }).then(entity => entity ?? undefined);
    }

    public findOneWithCache(id: string): Promise<PersonEntity | undefined> {
        return this.repository.findOne({
            where: {id},
            relations: {user: true},
            cache: 10000
        }).then(entity => entity ?? undefined);
    }

    public getOne(id: string): Promise<PersonEntity> {
        return this.repository.findOne({where: {id}, relations: {user: true}})
            .then(entity => {
                if (isNil(entity)) {
                    throw new NotFoundException(`Person not found with id: ${id}`);
                }
                return entity;
            });
    }

    public async findByIds(ids: Array<string>): Promise<Array<PersonEntity>> {
        const people = await this.repository.find({
            where: {
                id: In(ids)
            }
        });
        this.verifyAllIdHadPerson(ids, people);

        return people;
    }

    public async findAll(pageRequest: PageRequest): Promise<Pageable<PersonEntity>> {
        const fieldConverter = FilterOptionsFieldsConverter.of({
            'user.roles': (values: FilterOperation<unknown>) => Promise.resolve({key: 'user.roles.role', value: values})
        });
        pageRequest.where = await fieldConverter.convert(pageRequest.where);
        return this.getPage(pageRequest, {relations: {user: true}});
    }

    private verifyAllIdHadPerson(ids: Array<string>, people: Array<PersonEntity>): void {
        const idsOfPeople = people.map(e => e.id);
        const diff = ids.filter(id => !idsOfPeople.includes(id));

        if (isNotEmpty(diff)) {
            throw new NotFoundException(`Person not found with ids: ${diff}`);
        }
    }

}
