import {Module} from '@nestjs/common';
import {VisitActivityPersistenceModule} from '@be/visit-activity/visit-activity.persistence.module';
import {ActivityEntityToWrappedDtoConverter} from '@be/visit-activity/converter/activity-entity-to-wrapped-dto.converter';
import {ActivityEntityToBasicDtoConverter} from '@be/visit-activity/converter/activity-entity-to-basic-dto.converter';
import {ActivityInputToEntityConverter} from '@be/visit-activity/converter/activity-input-to-entity.converter';
import {VisitActivityCrudService} from '@be/visit-activity/visit-activity.crud.service';
import {VisitActivityController} from '@be/visit-activity/api/visit-activity.controller';
import {VisitPersistenceModule} from '@be/visit/visit.persistence.module';
import {VisitModule} from '@be/visit/visit.module';
import {ActivityRewriteApplierFactory} from '@be/visit-activity/applier/activity-rewrite-applier.factory';
import {VisitedChildrenPersistenceModule} from '@be/visit-children/persistence/visited-children.persistence.module';
import {VisitedChildrenModule} from '@be/visit-children/visited-children.module';
import {VisitActivityInfoPersistenceModule} from '@be/visit-activity-info/visit-activity-info.persistence.module';
import {VisitActivityInfoModule} from '@be/visit-activity-info/visit-activity-info.module';
import {VisitActivitySaveValidatorFactory} from '@be/visit-activity/validator/visit-activity-save-validator-factory.service';

@Module({
    imports: [
        VisitActivityPersistenceModule,
        VisitPersistenceModule,
        VisitActivityInfoPersistenceModule,
        VisitActivityInfoModule,
        VisitModule,
        VisitedChildrenPersistenceModule,
        VisitedChildrenModule
    ],
    providers: [
        ActivityEntityToBasicDtoConverter,
        ActivityEntityToWrappedDtoConverter,
        ActivityInputToEntityConverter,
        VisitActivityCrudService,
        ActivityRewriteApplierFactory,
        VisitActivitySaveValidatorFactory
    ],
    controllers: [
        VisitActivityController
    ]
})
export class VisitActivityModule {
}
