import {Injectable} from '@nestjs/common';
import {HospitalVisitTempDataDao} from '@be/hospital-visit/hospital-visit-temp-data.dao';
import {HospitalVisitTempEntity} from '@be/hospital-visit/model/hospital-visit-temp.entity';
import {isNotNil} from '@shared/util/util';
import {randomUUID} from 'crypto';

@Injectable()
export class HospitalVisitTempDataService {

    constructor(private readonly tempDataDao: HospitalVisitTempDataDao) {
    }

    public async save(visitId: string, key: string, value: unknown): Promise<unknown> {
        const entity = await this.getEntity(visitId, key);
        entity.value = value;
        await this.tempDataDao.save(entity);
        return entity.value;
    }

    public async findAll(visitId: string): Promise<Record<string, unknown>> {
        const entities: Array<HospitalVisitTempEntity> = await this.tempDataDao.findAll(visitId);
        return this.convertEntitiesToObject(entities);
    }

    public removeAll(visitId: string): Promise<void> {
        return this.tempDataDao.removeAll(visitId);
    }

    private convertEntitiesToObject(entities: Array<HospitalVisitTempEntity>): Record<string, unknown> {
        return entities.reduce((result, entity) => {
            result[entity.key] = entity.value;
            return result;
        }, {});
    }

    private async getEntity(visitId: string, key: string): Promise<HospitalVisitTempEntity> {
        const savedEntity = await this.tempDataDao.findOne(visitId, key);
        if (isNotNil(savedEntity)) {
            return savedEntity;
        }

        return {
            id: randomUUID(),
            visitId,
            key
        };
    }

}
