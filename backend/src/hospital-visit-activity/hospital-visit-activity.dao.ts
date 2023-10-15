import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {In, Repository} from 'typeorm';
import {isNil} from '@shared/util/util';
import {HospitalVisitActivityEntity} from '@be/hospital-visit-activity/model/hospital-visit-activity.entity';

@Injectable()
export class HospitalVisitActivityDao {

    constructor(@InjectRepository(HospitalVisitActivityEntity)
                private readonly repository: Repository<HospitalVisitActivityEntity>) {
    }

    public save(entity: HospitalVisitActivityEntity): Promise<HospitalVisitActivityEntity> {
        return this.repository.save(entity);
    }

    public saveAll(entities: Array<HospitalVisitActivityEntity>): Promise<Array<HospitalVisitActivityEntity>> {
        return this.repository.save(entities);
    }

    public async delete(entity: HospitalVisitActivityEntity): Promise<void> {
        await this.repository.remove(entity);
    }

    public findOne(id: string): Promise<HospitalVisitActivityEntity | undefined> {
        return this.repository.findOne({
            where: {id},
            relations: {
                hospitalVisit: true
            },
        }).then(entity => entity ?? undefined);
    }

    public getOne(id: string): Promise<HospitalVisitActivityEntity> {
        return this.findOne(id).then(entity => {
            if (isNil(entity)) {
                throw new NotFoundException(`Hospital visit activity not found with id: ${id}`);
            }
            return entity;
        });
    }

    public findByVisitIds(ids: Array<string>): Promise<Array<HospitalVisitActivityEntity>> {
        return this.repository.find({
            relations: {
                hospitalVisit: true
            },
            where: {
                hospitalVisit: {
                    id: In(ids)
                }
            }
        });
    }

}
