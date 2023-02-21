import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Pageable} from '@shared/api-util/pageable';
import {WhereClosureConverter} from '@be/find-option-converter/where-closure.converter';
import {PageCreator} from '@be/crud/page-creator';
import {PageRequest} from '@be/crud/page-request';
import {isNil} from '@shared/util/util';
import {EventEntity} from '@be/event/model/event.entity';

@Injectable()
export class EventDao extends PageCreator<EventEntity> {

    constructor(@InjectRepository(EventEntity) repository: Repository<EventEntity>,
                whereClosureConverter: WhereClosureConverter) {
        super(repository, whereClosureConverter);
    }

    public findOne(id: string): Promise<EventEntity | undefined> {
        return this.repository.findOne({
            where: {id}, relations: {hospitalVisit: true}
        }).then(entity => entity ?? undefined);
    }

    public getOne(id: string): Promise<EventEntity> {
        return this.findOne(id).then(entity => {
            if (isNil(entity)) {
                throw new NotFoundException(`Event not found with id: ${id}`);
            }
            return entity;
        });
    }

    public findAll(pageRequest: PageRequest): Promise<Pageable<EventEntity>> {
        return this.getPage(pageRequest, {relations: {hospitalVisit: true}});
    }

}
