import {BadRequestException, Injectable} from '@nestjs/common';
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
import {VisitStatusForManageVisitedChildValidator} from '@be/hospital-visit-children/validator/visit-status-for-manage-visited-child.validator';
import {ChildCrudService} from '@be/child/child.crud.service';
import {HospitalVisitEntity} from '@be/hospital-visit/model/hospital-visit.entity';
import {isNil} from '@shared/util/util';
import {User} from '@shared/user/user';
import {VisitedChildEntity} from '@be/hospital-visit-children/persistence/model/visited-child.entity';

@Injectable()
export class VisitedChildSaverService {

    constructor(private readonly visitDao: HospitalVisitDao,
                private readonly childService: ChildCrudService,
                private readonly visitedChildrenDao: VisitedChildrenDao,
                private readonly creationToEntityConverter: VisitedChildCreationToEntityConverter,
                private readonly entityToDtoConverter: VisitedChildEntityToDtoConverter) {
    }

    public async save(visitId: string, visitedChildInput: VisitedChildInput, requester: User): Promise<VisitedChild> {
        const visit = await this.getVisit(visitId);

        if (isNil(visitedChildInput.child)) {
            return this.saveVisitedChild(visit,
                {...visitedChildInput, childId: visitedChildInput.childId!});
        }
        return this.saveChildThenVisitedChild(visit,
            {...visitedChildInput, child: visitedChildInput.child!}, requester);
    }

    // eslint-disable-next-line max-params-no-constructor/max-params-no-constructor
    public async update(visitId: string, visitedChildId: string,
                        visitedChildInput: VisitedChildEditInput, requester: User): Promise<VisitedChild> {
        const visitedChild = await this.visitedChildrenDao.getOne(visitedChildId);

        this.verifyVisitIdIsCorrect(visitedChild, visitId);
        this.verifyVisitChildIdIsCorrect(visitedChildInput, visitedChildId);

        visitedChild.child = await this.childService.rewriteEntity(visitedChild.child, visitedChildInput.child);
        visitedChild.isParentThere = visitedChildInput.isParentThere;

        const persisted = await this.visitedChildrenDao.save(visitedChild);
        return this.entityToDtoConverter.convert(persisted);
    }

    private async getVisit(visitId: string): Promise<HospitalVisitEntity> {
        const visit = await this.visitDao.getOne(visitId);
        VisitStatusForManageVisitedChildValidator.of().validate(visit);

        return visit;
    }

    private async saveVisitedChild(visit: HospitalVisitEntity, visitedChildInput: VisitedChildWithChildIdInput): Promise<VisitedChild> {
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

    private verifyVisitIdIsCorrect(visitedChild: VisitedChildEntity, visitId: string): void {
        if (visitedChild.visitId !== visitId) {
            throw new BadRequestException('VisitId is not the same as one in the url.');
        }
    }

    private verifyVisitChildIdIsCorrect(visitedChildInput: VisitedChildEditInput, visitedChildId: string): void {
        if (visitedChildInput.id !== visitedChildId) {
            throw new BadRequestException('VisitedChildId is not the same as one in the url.');
        }
    }

}
