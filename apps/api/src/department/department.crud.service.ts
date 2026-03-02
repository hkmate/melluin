import {Injectable} from '@nestjs/common';
import {
    Department,
    DepartmentCreation,
    departmentFilterableFields,
    departmentSortableFields,
    DepartmentUpdateChangeSet,
    Pageable,
    User
} from '@melluin/common';
import {PageConverter} from '@be/crud/convert/page.converter';
import {PageRequest} from '@be/crud/page-request';
import {DepartmentDao} from '@be/department/department.dao';
import {DepartmentEntity} from '@be/department/model/department.entity';
import {DepartmentEntityToDtoConverter} from '@be/department/converer/department-entity-to-dto.converter';
import {DepartmentCreationToEntityConverter} from '@be/department/converer/department-creation-to-entity.converter';
import {PageRequestFieldsValidator} from '@be/crud/validator/page-request-fields.validator';
import {DepartmentChangeApplierFactory} from '@be/department/applier/department-change-applier.factory';
import {DepartmentRewriteDto} from '@be/department/api/dto/department-rewrite.dto';
import {DepartmentRewriteApplierFactory} from '@be/department/applier/department-rewrite-applier.factory';

@Injectable()
export class DepartmentCrudService {

    constructor(private readonly departmentDao: DepartmentDao,
                private readonly departmentConverter: DepartmentEntityToDtoConverter,
                private readonly departmentCreationConverter: DepartmentCreationToEntityConverter,
                private readonly changeApplierFactory: DepartmentChangeApplierFactory,
                private readonly rewriteApplierFactory: DepartmentRewriteApplierFactory) {
    }

    public async save(departmentCreation: DepartmentCreation, requester: User): Promise<Department> {
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

    /** @deprecated Will be removed when frontend use PUT */
    public async change(departmentId: string, changeSet: DepartmentUpdateChangeSet, requester: User): Promise<Department> {
        const entity = await this.departmentDao.getOne(departmentId);
        this.applyChangesToEntity(entity, changeSet);
        const savedDepartment = await this.departmentDao.save(entity);
        return this.departmentConverter.convert(savedDepartment);
    }

    public async update(rewrite: DepartmentRewriteDto, requester: User): Promise<Department> {
        const entity = await this.departmentDao.getOne(rewrite.id);
        const applier = this.rewriteApplierFactory.createFor(rewrite, entity);
        const savedDepartment = await this.departmentDao.save(applier.applyChanges());
        return this.departmentConverter.convert(savedDepartment);
    }

    private applyChangesToEntity(entity: DepartmentEntity, changeSet: DepartmentUpdateChangeSet): void {
        this.changeApplierFactory
            .createApplierFor(changeSet)
            .applyOn(entity);
    }

}
