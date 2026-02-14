import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {isNil} from '@shared/util/util';
import {HospitalVisitDao} from '@be/hospital-visit/hospital-visit.dao';
import {randomUUID} from 'crypto';
import {HospitalVisitActivityInfoEntity} from '@be/hospital-visit-activity-info/model/hospital-visit-activity-info.entity';

@Injectable()
export class HospitalVisitActivityInfoDao {

    constructor(@InjectRepository(HospitalVisitActivityInfoEntity)
                private readonly repository: Repository<HospitalVisitActivityInfoEntity>,
                private readonly visitDao: HospitalVisitDao) {
    }

    public save(entity: HospitalVisitActivityInfoEntity): Promise<HospitalVisitActivityInfoEntity> {
        return this.repository.save(entity);
    }

    public async getOneByVisitId(visitId: string): Promise<HospitalVisitActivityInfoEntity> {
        const persisted = await this.findOneByVisitId(visitId);
        if (isNil(persisted)) {
            const hospitalVisit = await this.visitDao.getOne(visitId);
            return this.save({id: randomUUID(), hospitalVisit, content: null})
        }
        return persisted;
    }

    private findOneByVisitId(visitId: string): Promise<HospitalVisitActivityInfoEntity | null> {
        return this.repository.findOne({
            relations: {
                hospitalVisit: true
            },
            where: {hospitalVisit: {id: visitId}},
        });
    }

}
