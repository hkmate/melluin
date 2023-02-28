import {Module} from '@nestjs/common';
import {ChildPersistenceModule} from '@be/child/child-persistence.module';
import {ChildInputToEntityConverter} from '@be/child/converer/child-input-to-entity.converter';
import {ChildEntityToDtoConverter} from '@be/child/converer/child-entity-to-dto.converter';
import {ChildRewriteApplierFactory} from '@be/child/converer/child-rewrite-applier.factory';
import {ChildCrudService} from '@be/child/child.crud.service';
import {ChildController} from '@be/child/child.controller';


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
    ],
    controllers: [
        ChildController
    ]
})
export class ChildModule {
}
