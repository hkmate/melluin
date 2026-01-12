import {Injectable} from '@nestjs/common';
import {Pageable} from '@shared/api-util/pageable';
import {PageConverter} from '@be/crud/convert/page.converter';
import {User} from '@shared/user/user';
import {PageRequest} from '@be/crud/page-request';
import {PageRequestFieldsValidator} from '@be/crud/validator/page-request-fields.validator';
import {HospitalVisitDao} from '@be/hospital-visit/hospital-visit.dao';
import {HospitalVisitCreationToEntityConverter} from '@be/hospital-visit/converer/hospital-visit-creation-to-entity.converter';
import {HospitalVisitCreate} from '@shared/hospital-visit/hospital-visit-create';
import {HospitalVisit} from '@shared/hospital-visit/hospital-visit';
import {HospitalVisitEntity} from '@be/hospital-visit/model/hospital-visit.entity';
import {HospitalVisitEntityToDtoConverter} from '@be/hospital-visit/converer/hospital-visit-entity-to-dto.converter';
import {HospitalVisitRewrite} from '@shared/hospital-visit/hospital-visit-rewrite';
import {
    hospitalVisitFilterableFields,
    hospitalVisitSortableFields
} from '@shared/hospital-visit/hospital-visit-filterable-fields';
import {HospitalVisitRewriteApplierFactory} from '@be/hospital-visit/applier/hospital-visit-rewrite-applier.factory';
import {AsyncValidatorChain} from '@shared/validator/validator-chain';
import {VisitIsNotInSameTimeAsOtherValidator} from '@be/hospital-visit/validator/visit-is-not-in-same-time-as-other.validator';
import {VisitCreateValidator, VisitRewriteValidator} from '@be/hospital-visit/validator/visit-validator';
import {VicariousMomVisitHasOnlyOneParticipantValidator} from '@be/hospital-visit/validator/vicarious-mom-visit-has-only-one-participant.validator';
import {ParticipantsIsInOneVisitAtSameTimeValidator} from '@be/hospital-visit/validator/participants-is-in-one-visit-at-same-time.validator';
import {UserCanCreateVisitValidator} from '@be/hospital-visit/validator/user-can-create-visit.validator';
import {UserCanModifyVisitValidator} from '@be/hospital-visit/validator/user-can-modify-visit.validator';
import {VisitIsNotConnectedWhenOtherThenStatusChangedValidator} from '@be/hospital-visit/validator/visit-is-not-connected-when-other-then-status-changed.validator';
import {VicariousMomVisitHasNoConnectionsValidator} from '@be/hospital-visit/validator/vicarious-mom-visit-has-no-connections.validator';

@Injectable()
export class HospitalVisitCrudService {

    constructor(private readonly hospitalVisitDao: HospitalVisitDao,
                private readonly rewriteApplierFactory: HospitalVisitRewriteApplierFactory,
                private readonly visitConverter: HospitalVisitEntityToDtoConverter,
                private readonly notInSameTimeAsOtherValidator: VisitIsNotInSameTimeAsOtherValidator,
                private readonly participantsIsInOneVisitAtSameTimeValidator: ParticipantsIsInOneVisitAtSameTimeValidator,
                private readonly visitCreationToEntityConverter: HospitalVisitCreationToEntityConverter) {
    }

    public async save(visitCreate: HospitalVisitCreate,
                      sameTimeVisitForced: boolean, requester: User): Promise<HospitalVisit> {
        await this.createValidatorsForCreate().validate({item: visitCreate, sameTimeVisitForced, requester});

        const creationEntity = await this.visitCreationToEntityConverter.convert(visitCreate);
        const visitEntity = await this.hospitalVisitDao.save(creationEntity);
        return this.visitConverter.convert(visitEntity);
    }

    public getOne(id: string): Promise<HospitalVisit> {
        return this.hospitalVisitDao.getOne(id)
            .then(entity => this.visitConverter.convert(entity))
    }

    public async find(pageRequest: PageRequest, requester: User): Promise<Pageable<HospitalVisit>> {
        PageRequestFieldsValidator
            .of(hospitalVisitSortableFields, hospitalVisitFilterableFields)
            .validate(pageRequest);

        const pageOfEntities: Pageable<HospitalVisitEntity> = await this.hospitalVisitDao.findAll(pageRequest);
        const pageConverter = PageConverter.of(this.visitConverter);
        return pageConverter.convert(pageOfEntities);
    }

    public async rewrite(hospitalVisitId: string,
                         visitRewrite: HospitalVisitRewrite,
                         sameTimeVisitForced: boolean,
                         requester: User): Promise<HospitalVisit> {
        const entity = await this.hospitalVisitDao.getOne(hospitalVisitId);

        await this.createValidatorsForUpdate().validate({item: visitRewrite, entity, sameTimeVisitForced, requester});

        const changedEntity = await this.rewriteApplierFactory.createFor(visitRewrite, entity).applyChanges();
        const savedVisit = await this.hospitalVisitDao.save(changedEntity);
        return this.visitConverter.convert(savedVisit);
    }

    private createValidatorsForCreate(): VisitCreateValidator {
        return AsyncValidatorChain.of(
            new UserCanCreateVisitValidator(),
            new VicariousMomVisitHasOnlyOneParticipantValidator(),
            this.notInSameTimeAsOtherValidator,
            this.participantsIsInOneVisitAtSameTimeValidator
        );
    }

    private createValidatorsForUpdate(): VisitRewriteValidator {
        return AsyncValidatorChain.of(
            new UserCanModifyVisitValidator(),
            new VisitIsNotConnectedWhenOtherThenStatusChangedValidator(),
            new VicariousMomVisitHasOnlyOneParticipantValidator(),
            new VicariousMomVisitHasNoConnectionsValidator(),
            this.notInSameTimeAsOtherValidator,
            this.participantsIsInOneVisitAtSameTimeValidator
        );
    }

}
