import {Injectable} from '@nestjs/common';
import {User, UUID, VisitStatuses} from '@melluin/common';
import {VisitEntity} from '@be/visit/model/visit.entity';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {VisitDao} from '@be/visit/visit.dao';

@Injectable()
export class VisitRelationDao {

    private static readonly RELATED_VISITS_SIZE = 10;
    private static readonly FINALIZED_STATUSES = [
        VisitStatuses.ACTIVITIES_FILLED_OUT,
        VisitStatuses.ALL_FILLED_OUT,
        VisitStatuses.SUCCESSFUL
    ];

    constructor(@InjectRepository(VisitEntity)
                private readonly repository: Repository<VisitEntity>,
                private readonly crudDao: VisitDao) {
    }

    public async findRelationIds(visitId: UUID, requester: User): Promise<Array<UUID>> {
        const currentVisit = await this.crudDao.getOne(visitId);
        return (await this.repository.createQueryBuilder()
            .from(VisitEntity, 'visit')
            .leftJoin('visit.department', 'department')
            .where(`department.id = '${currentVisit.department.id}'`)
            .andWhere(`visit.id <> '${currentVisit.id}'`)
            .andWhere('visit.status in (:...statuses)', {statuses: VisitRelationDao.FINALIZED_STATUSES})
            .orderBy('visit.dateTimeFrom', 'DESC')
            .take(VisitRelationDao.RELATED_VISITS_SIZE)
            .select('visit.id')
            .addSelect('visit.dateTimeFrom')
            .getMany()).map(e => e.id);
    }

}
