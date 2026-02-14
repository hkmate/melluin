import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Pageable} from '@shared/api-util/pageable';
import {WhereClosureConverter} from '@be/find-option-converter/where-closure.converter';
import {PageCreator} from '@be/crud/page-creator';
import {PageRequest} from '@be/crud/page-request';
import {DepartmentEntity} from '@be/department/model/department.entity';
import {isNil} from '@shared/util/util';

@Injectable()
export class DepartmentDao extends PageCreator<DepartmentEntity> {

    constructor(@InjectRepository(DepartmentEntity) repository: Repository<DepartmentEntity>,
                whereClosureConverter: WhereClosureConverter) {
        super(repository, whereClosureConverter);
    }

    public save(department: DepartmentEntity): Promise<DepartmentEntity> {
        return this.repository.save(department);
    }

    public findOne(id: string): Promise<DepartmentEntity | undefined> {
        return this.repository.findOne({
            where: {id},
        }).then(entity => entity ?? undefined);
    }

    public getOne(id: string): Promise<DepartmentEntity> {
        return this.findOne(id).then(entity => {
            if (isNil(entity)) {
                throw new NotFoundException(`Department not found with id: ${id}`);
            }
            return entity;
        });
    }

    public findAll(pageRequest: PageRequest): Promise<Pageable<DepartmentEntity>> {
        return this.getPage(pageRequest, {});
    }

}
