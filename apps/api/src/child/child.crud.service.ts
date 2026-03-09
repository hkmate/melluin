import {Injectable} from '@nestjs/common';
import {Child, ChildInput, User, UUID} from '@melluin/common';
import {ChildDao} from '@be/child/child.dao';
import {ChildInputToEntityConverter} from '@be/child/converer/child-input-to-entity.converter';
import {ChildEntityToDtoConverter} from '@be/child/converer/child-entity-to-dto.converter';
import {ChildRewriteApplierFactory} from '@be/child/converer/child-rewrite-applier.factory';
import {ChildEntity} from '@be/child/model/child.entity';

@Injectable()
export class ChildCrudService {

    constructor(private readonly childDao: ChildDao,
                private readonly rewriteApplierFactory: ChildRewriteApplierFactory,
                private readonly childConverter: ChildEntityToDtoConverter,
                private readonly inputToEntityConverter: ChildInputToEntityConverter) {
    }

    public async save(childCreate: ChildInput, requester: User): Promise<Child> {
        const creationEntity = this.inputToEntityConverter.convert(childCreate);
        const visitEntity = await this.childDao.save(creationEntity);
        return this.childConverter.convert(visitEntity);
    }

    public async rewriteEntity(childEntity: ChildEntity, childInput: ChildInput): Promise<ChildEntity> {
        const changedEntity = this.rewriteApplierFactory.createFor(childInput, childEntity).applyChanges();
        return await this.childDao.save(changedEntity);
    }

    public async remove(childId: UUID): Promise<void> {
        const entity = await this.childDao.getOne(childId);
        return this.childDao.remove(entity);
    }

}
