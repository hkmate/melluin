import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {HospitalVisitActivityInfoEntity} from '@be/hospital-visit-activity-info/model/hospital-visit-activity-info.entity';
import {HospitalVisitActivityInfoDao} from '@be/hospital-visit-activity-info/hospital-visit-activity-info.dao';
import {HospitalVisitPersistenceModule} from '@be/hospital-visit/hospital-visit.persistence.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            HospitalVisitActivityInfoEntity
        ]),

        HospitalVisitPersistenceModule
    ],
    providers: [
        HospitalVisitActivityInfoDao,
    ],
    exports: [HospitalVisitActivityInfoDao]
})
export class HospitalVisitActivityInfoPersistenceModule {
}
