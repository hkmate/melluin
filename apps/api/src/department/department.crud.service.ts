import {Injectable} from '@nestjs/common';
import {
    AsyncValidatorChain,
    Department,
    DepartmentCreation,
    departmentFilterableFields,
    departmentSortableFields,
    Pageable,
    User, UUID
} from '@melluin/common';
import {PageConverter} from '@be/crud/convert/page.converter';
import {PageRequest} from '@be/crud/page-request';
import {DepartmentDao} from '@be/department/department.dao';
import {DepartmentEntity} from '@be/department/model/department.entity';
import {DepartmentEntityToDtoConverter} from '@be/department/converer/department-entity-to-dto.converter';
import {DepartmentCreationToEntityConverter} from '@be/department/converer/department-creation-to-entity.converter';
import {PageRequestFieldsValidator} from '@be/crud/validator/page-request-fields.validator';
import {DepartmentRewriteDto} from '@be/department/api/dto/department-rewrite.dto';
import {DepartmentRewriteApplierFactory} from '@be/department/applier/department-rewrite-applier.factory';
import {DepartmentSaveValidatorFactory} from '@be/department/validator/department-save-validator-factory';
import {DepartmentCreateValidator, DepartmentRewriteValidator} from '@be/department/validator/department-validator';

@Injectable()
export class DepartmentCrudService {

    constructor(private readonly departmentDao: DepartmentDao,
                private readonly departmentConverter: DepartmentEntityToDtoConverter,
                private readonly departmentCreationConverter: DepartmentCreationToEntityConverter,
                private readonly validatorFactory: DepartmentSaveValidatorFactory,
                private readonly rewriteApplierFactory: DepartmentRewriteApplierFactory) {
    }

    public async save(item: DepartmentCreation, requester: User): Promise<Department> {
        const creationEntity = this.departmentCreationConverter.convert(item);

        await this.createValidatorsForCreate().validate({item, requester});

        const departmentEntity = await this.departmentDao.save(creationEntity);
        return this.departmentConverter.convert(departmentEntity);
    }

    public getOne(id: UUID): Promise<Department> {
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

    public async update(item: DepartmentRewriteDto, requester: User): Promise<Department> {
        const entity = await this.departmentDao.getOne(item.id);

        await this.createValidatorsForUpdate().validate({item, entity, requester});

        const applier = this.rewriteApplierFactory.createFor(item, entity);
        const savedDepartment = await this.departmentDao.save(applier.applyChanges());
        return this.departmentConverter.convert(savedDepartment);
    }

    private createValidatorsForCreate(): DepartmentCreateValidator {
        return AsyncValidatorChain.of(...this.validatorFactory.getValidatorsForCreate());
    }

    private createValidatorsForUpdate(): DepartmentRewriteValidator {
        return AsyncValidatorChain.of(...this.validatorFactory.getValidatorsForUpdate());
    }

}
