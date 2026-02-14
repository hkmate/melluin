import {Injectable} from '@nestjs/common';
import {VisitedChild} from '@shared/hospital-visit/visited-child';
import {VisitedChildrenDao} from '@be/hospital-visit-children/persistence/visited-children.dao';
import {HospitalVisitDao} from '@be/hospital-visit/hospital-visit.dao';
import {VisitedChildEntityToDtoConverter} from '@be/hospital-visit-children/converer/visited-child-entity-to-dto.converter';
import {ChildDao} from '@be/child/child.dao';
import {ChildEntity} from '@be/child/model/child.entity';
import {VisitedChildSaveValidatorFactory} from '@be/hospital-visit-children/validator/visited-child-save-validator-factory';
import {User} from '@shared/user/user';

@Injectable()
export class VisitedChildrenService {

    constructor(private readonly visitDao: HospitalVisitDao,
                private readonly childDao: ChildDao,
                private readonly visitedChildrenDao: VisitedChildrenDao,
                private readonly entityToDtoConverter: VisitedChildEntityToDtoConverter,
                private readonly validatorFactory: VisitedChildSaveValidatorFactory) {
    }

    public async findAll(visitId: string): Promise<Array<VisitedChild>> {
        return (await this.visitedChildrenDao.findAllByVisitId(visitId))
            .map(entity => this.entityToDtoConverter.convert(entity));
    }

    public async remove(visitId: string, visitedChildId: string, requester: User): Promise<void> {
        const visit = await this.visitDao.getOne(visitId);
        const visitedChild = await this.visitedChildrenDao.getOne(visitedChildId);

        await this.validatorFactory.getValidatorForDelete()
            .validate({visit, visitedChild, requester});

        await this.visitedChildrenDao.remove(visitedChild);
        await this.removeChildObjectIfNotInOtherVisit(visitedChild.child);
    }

    private async removeChildObjectIfNotInOtherVisit(child: ChildEntity): Promise<void> {
        const childInOtherVisit = await this.visitedChildrenDao.existsByChildId(child.id);
        if (childInOtherVisit) {
            return;
        }
        await this.childDao.remove(child);
    }

}
