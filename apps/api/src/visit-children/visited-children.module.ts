import {Module} from '@nestjs/common';
import {VisitedChildCreationToEntityConverter} from '@be/visit-children/converer/visited-child-creation-to-entity.converter';
import {VisitedChildrenPersistenceModule} from '@be/visit-children/persistence/visited-children.persistence.module';
import {VisitedChildrenService} from '@be/visit-children/service/visited-children.service';
import {VisitedChildrenController} from '@be/visit-children/api/visited-children.controller';
import {ChildPersistenceModule} from '@be/child/child-persistence.module';
import {VisitPersistenceModule} from '@be/visit/visit.persistence.module';
import {VisitedChildEntityToDtoConverter} from '@be/visit-children/converer/visited-child-entity-to-dto.converter';
import {VisitedChildVerifierService} from '@be/visit-children/service/visited-child-verifier.service';
import {ChildModule} from '@be/child/child.module';
import {VisitedChildSaverService} from '@be/visit-children/service/visited-child-saver.service';
import {VisitedChildSaveValidatorFactory} from '@be/visit-children/validator/visited-child-save-validator-factory';
import {VisitActivityPersistenceModule} from '@be/visit-activity/visit-activity.persistence.module';
import {NoActivityWithVisitedChildValidator} from '@be/visit-children/validator/no-activity-with-visited-child.validator';

@Module({
    imports: [
        VisitedChildrenPersistenceModule,

        VisitActivityPersistenceModule,
        VisitPersistenceModule,
        ChildPersistenceModule,
        ChildModule,
    ],
    providers: [
        VisitedChildrenService,
        VisitedChildVerifierService,
        VisitedChildSaverService,
        VisitedChildCreationToEntityConverter,
        VisitedChildEntityToDtoConverter,
        VisitedChildSaveValidatorFactory,
        NoActivityWithVisitedChildValidator
    ],
    controllers: [
        VisitedChildrenController
    ],
    exports: [
        VisitedChildrenService,
        VisitedChildVerifierService,
        VisitedChildSaverService,
        VisitedChildEntityToDtoConverter
    ],
})
export class VisitedChildrenModule {
}
