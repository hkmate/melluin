import {Module} from '@nestjs/common';
import {HospitalVisitActivityPersistenceModule} from '@be/hospital-visit-activity/hospital-visit-activity.persistence.module';
import {ActivityEntityToWrappedDtoConverter} from '@be/hospital-visit-activity/converter/activity-entity-to-wrapped-dto.converter';
import {ActivityEntityToBasicDtoConverter} from '@be/hospital-visit-activity/converter/activity-entity-to-basic-dto.converter';
import {ActivityInputToEntityConverter} from '@be/hospital-visit-activity/converter/activity-input-to-entity.converter';
import {HospitalVisitActivityCrudService} from '@be/hospital-visit-activity/hospital-visit-activity.crud.service';
import {HospitalVisitActivityController} from '@be/hospital-visit-activity/hospital-visit-activity.controller';
import {HospitalVisitPersistenceModule} from '@be/hospital-visit/hospital-visit.persistence.module';
import {HospitalVisitModule} from '@be/hospital-visit/hospital-visit.module';
import {ActivityRewriteApplierFactory} from '@be/hospital-visit-activity/applier/activity-rewrite-applier.factory';
import {VisitedChildrenPersistenceModule} from '@be/hospital-visit-children/persistence/visited-children.persistence.module';
import {VisitedChildrenModule} from '@be/hospital-visit-children/visited-children.module';
import {HospitalVisitActivityInfoPersistenceModule} from '@be/hospital-visit-activity-info/hospital-visit-activity-info.persistence.module';
import {HospitalVisitActivityInfoModule} from '@be/hospital-visit-activity-info/hospital-visit-activity-info.module';

@Module({
    imports: [
        HospitalVisitActivityPersistenceModule,
        HospitalVisitPersistenceModule,
        HospitalVisitActivityInfoPersistenceModule,
        HospitalVisitActivityInfoModule,
        HospitalVisitModule,
        VisitedChildrenPersistenceModule,
        VisitedChildrenModule
    ],
    providers: [
        ActivityEntityToBasicDtoConverter,
        ActivityEntityToWrappedDtoConverter,
        ActivityInputToEntityConverter,
        HospitalVisitActivityCrudService,
        ActivityRewriteApplierFactory,
    ],
    controllers: [
        HospitalVisitActivityController
    ]
})
export class HospitalVisitActivityModule {
}
