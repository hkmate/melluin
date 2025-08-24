import {Injectable} from '@nestjs/common';
import {User} from '@shared/user/user';
import {ChildInput} from '@shared/child/child-input';
import {Child} from '@shared/child/child';
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

    public getOne(id: string): Promise<Child> {
        return this.childDao.getOne(id)
            .then(entity => this.childConverter.convert(entity))
    }


    public async rewrite(childId: string,
                         childInput: ChildInput,
                         requester: User): Promise<Child> {
        const childEntity = await this.childDao.getOne(childId);
        const changedEntity = this.rewriteApplierFactory.createFor(childInput, childEntity).applyChanges();
        const savedVisit = await this.childDao.save(changedEntity);
        return this.childConverter.convert(savedVisit);
    }

    public async rewriteEntity(childEntity: ChildEntity,
                         childInput: ChildInput): Promise<ChildEntity> {
        const changedEntity = this.rewriteApplierFactory.createFor(childInput, childEntity).applyChanges();
        return await this.childDao.save(changedEntity);
    }

    public async remove(childId: string): Promise<void> {
        const entity = await this.childDao.getOne(childId);
        return this.childDao.remove(entity);
    }

}
