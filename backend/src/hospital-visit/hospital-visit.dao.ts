import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Pageable} from '@shared/api-util/pageable';
import {WhereClosureConverter} from '@be/find-option-converter/where-closure.converter';
import {PageCreator} from '@be/crud/page-creator';
import {PageRequest} from '@be/crud/page-request';
import {isNil} from '@shared/util/util';
import {HospitalVisitEntity} from '@be/hospital-visit/model/hospital-visit.entity';

@Injectable()
export class HospitalVisitDao extends PageCreator<HospitalVisitEntity> {

    constructor(@InjectRepository(HospitalVisitEntity) repository: Repository<HospitalVisitEntity>,
                whereClosureConverter: WhereClosureConverter) {
        super(repository, whereClosureConverter);
    }

    public save(department: HospitalVisitEntity): Promise<HospitalVisitEntity> {
        return this.repository.save(department);
    }

    public findOne(id: string): Promise<HospitalVisitEntity | undefined> {
        return this.repository.findOne({
            where: {id},
        }).then(entity => entity ?? undefined);
    }

    public getOne(id: string): Promise<HospitalVisitEntity> {
        return this.findOne(id).then(entity => {
            if (isNil(entity)) {
                throw new NotFoundException(`Event not found with id: ${id}`);
            }
            return entity;
        });
    }

    public findAll(pageRequest: PageRequest): Promise<Pageable<HospitalVisitEntity>> {
        return this.getPage(pageRequest, {});
    }

}
