import {Module} from '@nestjs/common';
import {VisitedChildCreationToEntityConverter} from '@be/hospital-visit-children/converer/visited-child-creation-to-entity.converter';
import {VisitedChildrenPersistenceModule} from '@be/hospital-visit-children/persistence/visited-children.persistence.module';
import {VisitedChildrenService} from '@be/hospital-visit-children/service/visited-children.service';
import {VisitedChildrenController} from '@be/hospital-visit-children/controller/visited-children.controller';
import {ChildPersistenceModule} from '@be/child/child-persistence.module';
import {HospitalVisitPersistenceModule} from '@be/hospital-visit/hospital-visit.persistence.module';
import {VisitedChildEntityToDtoConverter} from '@be/hospital-visit-children/converer/visited-child-entity-to-dto.converter';
import {VisitedChildVerifierService} from '@be/hospital-visit-children/service/visited-child-verifier.service';
import {ChildModule} from '@be/child/child.module';
import {VisitedChildSaverService} from '@be/hospital-visit-children/service/visited-child-saver.service';
import {VisitedChildSaveValidatorFactory} from '@be/hospital-visit-children/validator/visited-child-save-validator-factory';
import {HospitalVisitActivityPersistenceModule} from '@be/hospital-visit-activity/hospital-visit-activity.persistence.module';
import {NoActivityWithVisitedChildValidator} from '@be/hospital-visit-children/validator/no-activity-with-visited-child.validator';

@Module({
    imports: [
        VisitedChildrenPersistenceModule,

        HospitalVisitActivityPersistenceModule,
        HospitalVisitPersistenceModule,
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
