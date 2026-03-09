import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {In, Repository} from 'typeorm';
import {isNil, UUID} from '@melluin/common';
import {VisitActivityEntity} from '@be/visit-activity/model/visit-activity.entity';

@Injectable()
export class VisitActivityDao {

    constructor(@InjectRepository(VisitActivityEntity)
                private readonly repository: Repository<VisitActivityEntity>) {
    }

    public save(entity: VisitActivityEntity): Promise<VisitActivityEntity> {
        return this.repository.save(entity);
    }

    public saveAll(entities: Array<VisitActivityEntity>): Promise<Array<VisitActivityEntity>> {
        return this.repository.save(entities);
    }

    public async delete(entity: VisitActivityEntity): Promise<void> {
        await this.repository.remove(entity);
    }

    public findOne(id: UUID): Promise<VisitActivityEntity | undefined> {
        return this.repository.findOne({
            where: {id},
            relations: {
                visit: true
            },
        }).then(entity => entity ?? undefined);
    }

    public getOne(id: UUID): Promise<VisitActivityEntity> {
        return this.findOne(id).then(entity => {
            if (isNil(entity)) {
                throw new NotFoundException(`Visit activity not found with id: ${id}`);
            }
            return entity;
        });
    }

    public findByVisitIds(ids: Array<UUID>): Promise<Array<VisitActivityEntity>> {
        return this.repository.find({
            relations: {
                visit: true
            },
            where: {
                visit: {
                    id: In(ids)
                }
            }
        });
    }

    public findByVisitId(id: UUID): Promise<Array<VisitActivityEntity>> {
        return this.repository.find({
            where: {
                visit: {id}
            }
        });
    }

}
