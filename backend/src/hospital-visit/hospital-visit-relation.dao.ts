import {Injectable} from '@nestjs/common';
import {User} from '@shared/user/user';
import {HospitalVisitEntity} from '@be/hospital-visit/model/hospital-visit.entity';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {HospitalVisitDao} from '@be/hospital-visit/hospital-visit.dao';
import {HospitalVisitStatus} from '@shared/hospital-visit/hospital-visit-status';

@Injectable()
export class HospitalVisitRelationDao {

    private static readonly RELATED_VISITS_SIZE = 10;
    private static readonly FINALIZED_STATUSES = [
        HospitalVisitStatus.ACTIVITIES_FILLED_OUT,
        HospitalVisitStatus.ALL_FILLED_OUT,
        HospitalVisitStatus.SUCCESSFUL
    ];

    constructor(@InjectRepository(HospitalVisitEntity)
                private readonly repository: Repository<HospitalVisitEntity>,
                private readonly crudDao: HospitalVisitDao) {
    }

    public async findRelationIds(visitId: string, requester: User): Promise<Array<string>> {
        const currentVisit = await this.crudDao.getOne(visitId);
        return (await this.repository.createQueryBuilder()
            .from(HospitalVisitEntity, 'visit')
            .leftJoin('visit.department', 'department')
            .where(`department.id = '${currentVisit.department.id}'`)
            .andWhere(`visit.id <> '${currentVisit.id}'`)
            .andWhere('visit.status in (:...statuses)', {statuses: HospitalVisitRelationDao.FINALIZED_STATUSES})
            .orderBy('visit.dateTimeFrom', 'DESC')
            .take(HospitalVisitRelationDao.RELATED_VISITS_SIZE)
            .select('visit.id')
            .addSelect('visit.dateTimeFrom')
            .getMany()).map(e => e.id);
    }

}
