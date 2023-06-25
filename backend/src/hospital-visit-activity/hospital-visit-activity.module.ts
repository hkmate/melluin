import {Module} from '@nestjs/common';
import {HospitalVisitActivityPersistenceModule} from '@be/hospital-visit-activity/hospital-visit-activity.persistence.module';
import {ActivityEntityToWrappedDtoConverter} from '@be/hospital-visit-activity/converter/activity-entity-to-wrapped-dto.converter';
import {ActivityEntityToBasicDtoConverter} from '@be/hospital-visit-activity/converter/activity-entity-to-basic-dto.converter';
import {ActivityInputToEntityConverter} from '@be/hospital-visit-activity/converter/activity-input-to-entity.converter';
import {HospitalVisitActivityCrudService} from '@be/hospital-visit-activity/hospital-visit-activity.crud.service';
import {HospitalVisitActivityController} from '@be/hospital-visit-activity/hospital-visit-activity.controller';
import {HospitalVisitPersistenceModule} from '@be/hospital-visit/hospital-visit.persistence.module';
import {ChildModule} from '@be/child/child.module';
import {HospitalVisitModule} from '@be/hospital-visit/hospital-visit.module';
import {ChildPersistenceModule} from '@be/child/child-persistence.module';
import {ActivityRewriteApplierFactory} from '@be/hospital-visit-activity/applier/activity-rewrite-applier.factory';

@Module({
    imports: [
        HospitalVisitActivityPersistenceModule,
        HospitalVisitPersistenceModule,
        HospitalVisitModule,
        ChildPersistenceModule,
        ChildModule
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
