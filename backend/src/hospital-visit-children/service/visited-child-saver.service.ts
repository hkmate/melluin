import {Injectable} from '@nestjs/common';
import {
    VisitedChild,
    VisitedChildEditInput,
    VisitedChildInput,
    VisitedChildWithChildIdInput,
    VisitedChildWithChildInput
} from '@shared/hospital-visit/visited-child';
import {VisitedChildrenDao} from '@be/hospital-visit-children/persistence/visited-children.dao';
import {HospitalVisitDao} from '@be/hospital-visit/hospital-visit.dao';
import {VisitedChildCreationToEntityConverter} from '@be/hospital-visit-children/converer/visited-child-creation-to-entity.converter';
import {VisitedChildEntityToDtoConverter} from '@be/hospital-visit-children/converer/visited-child-entity-to-dto.converter';
import {ChildCrudService} from '@be/child/child.crud.service';
import {HospitalVisitEntity} from '@be/hospital-visit/model/hospital-visit.entity';
import {isNil} from '@shared/util/util';
import {User} from '@shared/user/user';
import {VisitedChildSaveValidatorFactory} from '@be/hospital-visit-children/validator/visited-child-save-validator-factory';

@Injectable()
export class VisitedChildSaverService {

    constructor(private readonly visitDao: HospitalVisitDao,
                private readonly childService: ChildCrudService,
                private readonly visitedChildrenDao: VisitedChildrenDao,
                private readonly creationToEntityConverter: VisitedChildCreationToEntityConverter,
                private readonly entityToDtoConverter: VisitedChildEntityToDtoConverter,
                private readonly validatorFactory: VisitedChildSaveValidatorFactory) {
    }

    public async save(visitId: string, visitedChildInput: VisitedChildInput, requester: User): Promise<VisitedChild> {
        const visit = await this.visitDao.getOne(visitId);

        await this.validatorFactory.getValidatorForCreate()
            .validate({visit, requester});

        if (isNil(visitedChildInput.child)) {
            return this.saveVisitedChild(visit,
                {...visitedChildInput, childId: visitedChildInput.childId!});
        }
        return this.saveChildThenVisitedChild(visit,
            {...visitedChildInput, child: visitedChildInput.child!}, requester);
    }


    public async update(visitId: string, visitedChildInput: VisitedChildEditInput, requester: User): Promise<VisitedChild> {
        const visit = await this.visitDao.getOne(visitId);
        const visitedChild = await this.visitedChildrenDao.getOne(visitedChildInput.id);

        await this.validatorFactory.getValidatorForUpdate()
            .validate({visit, visitedChild, requester});

        visitedChild.child = await this.childService.rewriteEntity(visitedChild.child, visitedChildInput.child);
        visitedChild.isParentThere = visitedChildInput.isParentThere;

        const persisted = await this.visitedChildrenDao.save(visitedChild);
        return this.entityToDtoConverter.convert(persisted);
    }

    private async saveVisitedChild(visit: HospitalVisitEntity,
                                   visitedChildInput: VisitedChildWithChildIdInput): Promise<VisitedChild> {
        const createEntity = await this.creationToEntityConverter.convert({visitedChildInput, visit});
        const persisted = await this.visitedChildrenDao.save(createEntity);

        return this.entityToDtoConverter.convert(persisted);
    }

    private async saveChildThenVisitedChild(visit: HospitalVisitEntity,
                                            visitedChildInput: VisitedChildWithChildInput,
                                            requester: User): Promise<VisitedChild> {
        const child = await this.childService.save(visitedChildInput.child!, requester);
        const visitedChildInput2 = {...visitedChildInput, child: undefined, childId: child.id};
        try {
            return this.saveVisitedChild(visit, visitedChildInput2);
        } catch (e) {
            await this.childService.remove(child.id);
            throw e;
        }
    }

}
