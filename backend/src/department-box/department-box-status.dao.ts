import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Pageable} from '@shared/api-util/pageable';
import {WhereClosureConverter} from '@be/find-option-converter/where-closure.converter';
import {PageCreator} from '@be/crud/page-creator';
import {PageRequest} from '@be/crud/page-request';
import {DepartmentBoxStatusEntity} from '@be/department-box/model/department-box-status.entity';

@Injectable()
export class DepartmentBoxStatusDao extends PageCreator<DepartmentBoxStatusEntity> {

    constructor(@InjectRepository(DepartmentBoxStatusEntity) repository: Repository<DepartmentBoxStatusEntity>,
                whereClosureConverter: WhereClosureConverter) {
        super(repository, whereClosureConverter);
    }

    public save(department: DepartmentBoxStatusEntity): Promise<DepartmentBoxStatusEntity> {
        return this.repository.save(department);
    }

    public findAll(departmentId: string, pageRequest: PageRequest): Promise<Pageable<DepartmentBoxStatusEntity>> {
        return this.getPage(pageRequest, {where: {department: {id: departmentId}}});
    }

}
