import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {In, Repository} from 'typeorm';
import {VisitedChildEntity} from '@be/hospital-visit-children/persistence/model/visited-child.entity';
import {isNil, toOptional} from '@shared/util/util';

@Injectable()
export class VisitedChildrenDao {

    constructor(@InjectRepository(VisitedChildEntity) private repository: Repository<VisitedChildEntity>) {
    }

    public save(visitedChildEntity: VisitedChildEntity): Promise<VisitedChildEntity> {
        return this.repository.save(visitedChildEntity);
    }

    public findOne(visitedChildId: string): Promise<VisitedChildEntity | undefined> {
        return this.repository.findOneBy({id: visitedChildId}).then(toOptional);
    }

    public getOne(id: string): Promise<VisitedChildEntity> {
        return this.findOne(id).then(entity => {
            if (isNil(entity)) {
                throw new NotFoundException(`Visited child object not found with id: ${id}`);
            }
            return entity;
        });
    }

    public findAllByIds(ids: Array<string>): Promise<Array<VisitedChildEntity>> {
        return this.repository.find({where: {id: In(ids)}});
    }

    public async findIdByIds(ids: Array<string>): Promise<Array<string>> {
        const entityParts = await this.repository.find({where: {id: In(ids)}, select: {id: true}});
        return entityParts.map(e => e.id);
    }

    public findAllByVisitId(visitId: string): Promise<Array<VisitedChildEntity>> {
        return this.repository.find({where: {visitId}});
    }

    public existsByChildId(childId: string): Promise<boolean> {
        return this.repository.exist({where: {child: {id: childId}}});
    }

    public async remove(visitedChildEntity: VisitedChildEntity): Promise<void> {
        await this.repository.remove(visitedChildEntity);
    }

}
