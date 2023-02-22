import {Injectable} from '@nestjs/common';
import {Pageable} from '@shared/api-util/pageable';
import {PageConverter} from '@be/crud/convert/page.converter';
import {User} from '@shared/user/user';
import {PageRequest} from '@be/crud/page-request';
import {DepartmentDao} from '@be/department/department.dao';
import {Department} from '@shared/department/department';
import {DepartmentUpdateChangeSet} from '@shared/department/department-update-change-set';
import {DepartmentCreation} from '@shared/department/department-creation';
import {DepartmentEntity} from '@be/department/model/department.entity';
import {DepartmentEntityToDtoConverter} from '@be/department/converer/department-entity-to-dto.converter';
import {DepartmentCreationToEntityConverter} from '@be/department/converer/department-creation-to-entity.converter';
import {CanUserManageDepartmentValidator} from '@be/department/validator/can-user-manage-department.validator';
import {PageRequestFieldsValidator} from '@be/crud/validator/page-request-fields.validator';
import {departmentFilterableFields, departmentSortableFields} from '@shared/department/department-filterable-fields';
import {DepartmentChangeApplierFactory} from '@be/department/applier/department-change-applier.factory';

@Injectable()
export class DepartmentCrudService {

    constructor(private readonly departmentDao: DepartmentDao,
                private readonly departmentConverter: DepartmentEntityToDtoConverter,
                private readonly departmentCreationConverter: DepartmentCreationToEntityConverter,
                private readonly changeApplierFactory: DepartmentChangeApplierFactory) {
    }

    public async save(departmentCreation: DepartmentCreation, requester: User): Promise<Department> {
        CanUserManageDepartmentValidator
            .of(requester)
            .validate();
        const creationEntity = this.departmentCreationConverter.convert(departmentCreation);
        const departmentEntity = await this.departmentDao.save(creationEntity);
        return this.departmentConverter.convert(departmentEntity);
    }

    public getOne(id: string): Promise<Department> {
        return this.departmentDao.getOne(id)
            .then(entity => this.departmentConverter.convert(entity))
    }

    public async find(pageRequest: PageRequest, requester: User): Promise<Pageable<Department>> {
        PageRequestFieldsValidator
            .of(departmentSortableFields, departmentFilterableFields)
            .validate(pageRequest);

        const pageOfEntities: Pageable<DepartmentEntity> = await this.departmentDao.findAll(pageRequest);
        const pageConverter = PageConverter.of(this.departmentConverter);
        return pageConverter.convert(pageOfEntities);
    }

    public async update(departmentId: string, changeSet: DepartmentUpdateChangeSet, requester: User): Promise<Department> {
        const person = await this.departmentDao.getOne(departmentId);
        CanUserManageDepartmentValidator
            .of(requester)
            .validate();

        this.applyChangesToEntity(person, changeSet);
        const savedDepartment = await this.departmentDao.save(person);
        return this.departmentConverter.convert(savedDepartment);
    }

    private applyChangesToEntity(entity: DepartmentEntity, changeSet: DepartmentUpdateChangeSet): void {
        this.changeApplierFactory
            .createApplierFor(changeSet)
            .applyOn(entity);
    }

}
