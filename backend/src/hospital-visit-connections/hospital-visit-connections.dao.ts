import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Equal, Not, Repository} from 'typeorm';
import {HospitalVisitEntity} from '@be/hospital-visit/model/hospital-visit.entity';
import {isNil} from '@shared/util/util';


@Injectable()
export class HospitalVisitConnectionsDao {

    constructor(@InjectRepository(HospitalVisitEntity) private readonly repository: Repository<HospitalVisitEntity>) {
    }

    public findAll(connectionGroupId: string): Promise<Array<HospitalVisitEntity>> {
        return this.repository.findBy({connectionGroupId});
    }

    public async findAllConnections(visitId: string): Promise<Array<HospitalVisitEntity>> {
        const visit = await this.getOne(visitId);
        return this.repository.findBy({connectionGroupId: visit.connectionGroupId, id: Not(Equal(visit.id))});
    }

    public getConnectionGroupSize(connectionGroupId: string): Promise<number> {
        return this.repository.countBy({connectionGroupId});
    }

    public isConnectionGroupIdUsed(connectionGroupId: string): Promise<boolean> {
        return this.repository.exist({where: {connectionGroupId}});
    }

    private async getOne(id: string): Promise<HospitalVisitEntity> {
        const entity = await this.repository.findOne({where: {id}});
        if (isNil(entity)) {
            throw new NotFoundException(`Event not found with id: ${id}`);
        }
        return entity;
    }

}
