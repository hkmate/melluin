import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {isNil, UUID} from '@melluin/common';
import {VisitDao} from '@be/visit/visit.dao';
import {randomUUID} from 'crypto';
import {VisitActivityInfoEntity} from '@be/visit-activity-info/model/visit-activity-info.entity';

@Injectable()
export class VisitActivityInfoDao {

    constructor(@InjectRepository(VisitActivityInfoEntity)
                private readonly repository: Repository<VisitActivityInfoEntity>,
                private readonly visitDao: VisitDao) {
    }

    public save(entity: VisitActivityInfoEntity): Promise<VisitActivityInfoEntity> {
        return this.repository.save(entity);
    }

    public async getOneByVisitId(visitId: UUID): Promise<VisitActivityInfoEntity> {
        const persisted = await this.findOneByVisitId(visitId);
        if (isNil(persisted)) {
            const visit = await this.visitDao.getOne(visitId);
            return this.save({id: randomUUID(), visit: visit, content: null})
        }
        return persisted;
    }

    private findOneByVisitId(visitId: UUID): Promise<VisitActivityInfoEntity | null> {
        return this.repository.findOne({
            relations: {
                visit: true
            },
            where: {visit: {id: visitId}},
        });
    }

}
