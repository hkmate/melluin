import {Module} from '@nestjs/common';
import {HospitalVisitPersistenceModule} from '@be/hospital-visit/hospital-visit.persistence.module';
import {HospitalVisitActivityInfoController} from '@be/hospital-visit-activity-info/hospital-visit-activity-info.controller';
import {ActivityInfoEntityToDtoConverter} from '@be/hospital-visit-activity-info/converter/activity-info-entity-to-dto.converter';
import {HospitalVisitActivityInfoCrudService} from '@be/hospital-visit-activity-info/hospital-visit-activity-info.crud.service';
import {HospitalVisitActivityInfoPersistenceModule} from '@be/hospital-visit-activity-info/hospital-visit-activity-info.persistence.module';

@Module({
    imports: [
        HospitalVisitPersistenceModule,
        HospitalVisitActivityInfoPersistenceModule
    ],
    providers: [
        ActivityInfoEntityToDtoConverter,
        HospitalVisitActivityInfoCrudService
    ],
    exports: [
        ActivityInfoEntityToDtoConverter
    ],
    controllers: [
        HospitalVisitActivityInfoController
    ]
})
export class HospitalVisitActivityInfoModule {
}
