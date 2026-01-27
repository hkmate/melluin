import {Module} from '@nestjs/common';
import {ChildPersistenceModule} from '@be/child/child-persistence.module';
import {ChildInputToEntityConverter} from '@be/child/converer/child-input-to-entity.converter';
import {ChildEntityToDtoConverter} from '@be/child/converer/child-entity-to-dto.converter';
import {ChildRewriteApplierFactory} from '@be/child/converer/child-rewrite-applier.factory';
import {ChildCrudService} from '@be/child/child.crud.service';

@Module({
    imports: [
        ChildPersistenceModule
    ],
    providers: [
        ChildCrudService,
        ChildInputToEntityConverter,
        ChildEntityToDtoConverter,
        ChildRewriteApplierFactory
    ],
    exports: [
        ChildCrudService,
        ChildInputToEntityConverter,
        ChildEntityToDtoConverter,
        ChildRewriteApplierFactory
    ]
})
export class ChildModule {
}
