import {BadRequestException, Injectable} from '@nestjs/common';
import {VisitedChild} from '@shared/hospital-visit/visited-child';
import {VisitedChildrenDao} from '@be/hospital-visit-children/persistence/visited-children.dao';
import {HospitalVisitDao} from '@be/hospital-visit/hospital-visit.dao';
import {VisitedChildEntityToDtoConverter} from '@be/hospital-visit-children/converer/visited-child-entity-to-dto.converter';
import {VisitedChildEntity} from '@be/hospital-visit-children/persistence/model/visited-child.entity';
import {ChildDao} from '@be/child/child.dao';
import {VisitStatusForManageVisitedChildValidator} from '@be/hospital-visit-children/validator/visit-status-for-manage-visited-child.validator';
import {ChildEntity} from '@be/child/model/child.entity';

@Injectable()
export class VisitedChildrenService {

    constructor(private readonly visitDao: HospitalVisitDao,
                private readonly childDao: ChildDao,
                private readonly visitedChildrenDao: VisitedChildrenDao,
                private readonly entityToDtoConverter: VisitedChildEntityToDtoConverter) {
    }

    public async findAll(visitId: string): Promise<Array<VisitedChild>> {
        return (await this.visitedChildrenDao.findAllByVisitId(visitId))
            .map(entity => this.entityToDtoConverter.convert(entity));
    }

    public async remove(visitId: string, visitedChildId: string): Promise<void> {
        const visit = await this.visitDao.getOne(visitId);
        VisitStatusForManageVisitedChildValidator.of().validate(visit);
        // TODO: validate that child is not on any activity of the visit!

        const entity = await this.visitedChildrenDao.getOne(visitedChildId);
        const child = entity.child;
        this.verifyEntityHasThisVisitId(entity, visitId);

        await this.visitedChildrenDao.remove(entity);
        await this.removeChildObjectIfNotInOtherVisit(child);
    }

    private verifyEntityHasThisVisitId(entity: VisitedChildEntity, visitId: string): void {
        if (entity.visitId !== visitId) {
            throw new BadRequestException(
                `VisitedChild object with id: ${entity.id} is not belongs to visit with id: ${visitId}`);
        }
    }

    private async removeChildObjectIfNotInOtherVisit(child: ChildEntity): Promise<void> {
        const childInOtherVisit = await this.visitedChildrenDao.existsByChildId(child.id);
        if (childInOtherVisit) {
            return;
        }
        await this.childDao.remove(child);
    }

}
