import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {HospitalVisitTempEntity} from '@be/hospital-visit/model/hospital-visit-temp.entity';

@Injectable()
export class HospitalVisitTempDataDao {

    constructor(@InjectRepository(HospitalVisitTempEntity) private repository: Repository<HospitalVisitTempEntity>) {
    }

    public save(department: HospitalVisitTempEntity): Promise<HospitalVisitTempEntity> {
        return this.repository.save(department);
    }

    public findOne(visitId: string, key: string): Promise<HospitalVisitTempEntity | null> {
        return this.repository.findOne({where: {visitId, key}});
    }

    public findAll(visitId: string): Promise<Array<HospitalVisitTempEntity>> {
        return this.repository.find({where: {visitId}});
    }

    public async removeAll(visitId: string): Promise<void> {
        const entities = await this.findAll(visitId)
        await this.repository.remove(entities);
    }

}
