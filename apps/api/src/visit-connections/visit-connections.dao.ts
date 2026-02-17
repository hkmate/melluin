import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Equal, Not, Repository} from 'typeorm';
import {VisitEntity} from '@be/visit/model/visit.entity';
import {isNil} from '@melluin/common';


@Injectable()
export class VisitConnectionsDao {

    constructor(@InjectRepository(VisitEntity) private readonly repository: Repository<VisitEntity>) {
    }

    public findAll(connectionGroupId: string): Promise<Array<VisitEntity>> {
        return this.repository.findBy({connectionGroupId});
    }

    public async findAllConnections(visitId: string): Promise<Array<VisitEntity>> {
        const visit = await this.getOne(visitId);
        return this.repository.findBy({connectionGroupId: visit.connectionGroupId, id: Not(Equal(visit.id))});
    }

    public getConnectionGroupSize(connectionGroupId: string): Promise<number> {
        return this.repository.countBy({connectionGroupId});
    }

    public isConnectionGroupIdUsed(connectionGroupId: string): Promise<boolean> {
        return this.repository.exist({where: {connectionGroupId}});
    }

    private async getOne(id: string): Promise<VisitEntity> {
        const entity = await this.repository.findOne({where: {id}});
        if (isNil(entity)) {
            throw new NotFoundException(`Event not found with id: ${id}`);
        }
        return entity;
    }

}
