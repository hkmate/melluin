import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {In, Repository} from 'typeorm';
import {isNil} from '@shared/util/util';
import {ChildEntity} from '@be/child/model/child.entity';

@Injectable()
export class ChildDao {

    constructor(@InjectRepository(ChildEntity) private readonly repository: Repository<ChildEntity>,) {
    }

    public save(department: ChildEntity): Promise<ChildEntity> {
        return this.repository.save(department);
    }

    public findOne(id: string): Promise<ChildEntity | undefined> {
        return this.repository.findOne({
            where: {id},
        }).then(entity => entity ?? undefined);
    }

    public getOne(id: string): Promise<ChildEntity> {
        return this.findOne(id).then(entity => {
            if (isNil(entity)) {
                throw new NotFoundException(`Child not found with id: ${id}`);
            }
            return entity;
        });
    }

    public findByIds(ids: Array<string>): Promise<Array<ChildEntity>> {
        return this.repository.find({where: {id: In(ids)}});
    }

}
