import {Injectable} from '@nestjs/common';
import {PageConverter} from '@be/crud/convert/page.converter';
import {PageRequest} from '@be/crud/page-request';
import {PageRequestFieldsValidator} from '@be/crud/validator/page-request-fields.validator';
import {VisitDao} from '@be/visit/visit.dao';
import {VisitCreationToEntityConverter} from '@be/visit/converer/visit-creation-to-entity.converter';
import {VisitEntity} from '@be/visit/model/visit.entity';
import {VisitEntityToDtoConverter} from '@be/visit/converer/visit-entity-to-dto.converter';
import {VisitRewriteApplierFactory} from '@be/visit/applier/visit-rewrite-applier.factory';
import {VisitCreateValidator, VisitRewriteValidator} from '@be/visit/validator/visit-validator';
import {VisitSaveValidatorFactory} from '@be/visit/validator/visit-save-validator-factory';
import {
    AsyncValidatorChain,
    Pageable,
    User,
    UUID,
    Visit,
    VisitCreate,
    visitFilterableFields,
    VisitRewrite,
    visitSortableFields
} from '@melluin/common';

@Injectable()
export class VisitCrudService {

    constructor(private readonly visitDao: VisitDao,
                private readonly rewriteApplierFactory: VisitRewriteApplierFactory,
                private readonly visitConverter: VisitEntityToDtoConverter,
                private readonly validatorFactory: VisitSaveValidatorFactory,
                private readonly visitCreationToEntityConverter: VisitCreationToEntityConverter) {
    }

    public async save(visitCreate: VisitCreate, sameTimeVisitForced: boolean,
                      requester: User): Promise<Visit> {
        await this.createValidatorsForCreate().validate({item: visitCreate, sameTimeVisitForced, requester});

        const creationEntity = await this.visitCreationToEntityConverter.convert({
            ...visitCreate,
            organizerId: requester.personId
        });
        const visitEntity = await this.visitDao.save(creationEntity);
        return this.visitConverter.convert(visitEntity);
    }

    public getOne(id: UUID): Promise<Visit> {
        return this.visitDao.getOne(id)
            .then(entity => this.visitConverter.convert(entity))
    }

    public async find(pageRequest: PageRequest, requester: User): Promise<Pageable<Visit>> {
        PageRequestFieldsValidator
            .of(visitSortableFields, visitFilterableFields)
            .validate(pageRequest);

        const pageOfEntities: Pageable<VisitEntity> = await this.visitDao.findAll(pageRequest);
        const pageConverter = PageConverter.of(this.visitConverter);
        return pageConverter.convert(pageOfEntities);
    }

    public async rewrite(visitId: UUID, visitRewrite: VisitRewrite,
                         sameTimeVisitForced: boolean, requester: User): Promise<Visit> {
        const entity = await this.visitDao.getOne(visitId);

        await this.createValidatorsForUpdate().validate({item: visitRewrite, entity, sameTimeVisitForced, requester});

        const changedEntity = await this.rewriteApplierFactory.createFor(visitRewrite, entity).applyChanges();
        const savedVisit = await this.visitDao.save(changedEntity);
        return this.visitConverter.convert(savedVisit);
    }

    private createValidatorsForCreate(): VisitCreateValidator {
        return AsyncValidatorChain.of(...this.validatorFactory.getValidatorsForCreate());
    }

    private createValidatorsForUpdate(): VisitRewriteValidator {
        return AsyncValidatorChain.of(...this.validatorFactory.getValidatorsForUpdate());
    }

}
