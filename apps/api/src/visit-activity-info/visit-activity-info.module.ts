import {Module} from '@nestjs/common';
import {VisitPersistenceModule} from '@be/visit/visit.persistence.module';
import {VisitActivityInfoController} from '@be/visit-activity-info/api/visit-activity-info.controller';
import {ActivityInfoEntityToDtoConverter} from '@be/visit-activity-info/converter/activity-info-entity-to-dto.converter';
import {VisitActivityInfoCrudService} from '@be/visit-activity-info/visit-activity-info.crud.service';
import {VisitActivityInfoPersistenceModule} from '@be/visit-activity-info/visit-activity-info.persistence.module';

@Module({
    imports: [
        VisitPersistenceModule,
        VisitActivityInfoPersistenceModule
    ],
    providers: [
        ActivityInfoEntityToDtoConverter,
        VisitActivityInfoCrudService
    ],
    exports: [
        ActivityInfoEntityToDtoConverter
    ],
    controllers: [
        VisitActivityInfoController
    ]
})
export class VisitActivityInfoModule {
}
