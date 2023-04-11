import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {FindOptionConverterModule} from '@be/find-option-converter/find-option-converter.module';
import {HospitalVisitEntity} from '@be/hospital-visit/model/hospital-visit.entity';
import {HospitalVisitDao} from '@be/hospital-visit/hospital-visit.dao';
import {HospitalVisitRelationDao} from '@be/hospital-visit/hospital-visit-relation.dao';
import {HospitalVisitTempDataDao} from '@be/hospital-visit/hospital-visit-temp-data.dao';
import {HospitalVisitTempEntity} from '@be/hospital-visit/model/hospital-visit-temp.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            HospitalVisitEntity,
            HospitalVisitTempEntity,
        ]),

        FindOptionConverterModule,
    ],
    providers: [
        HospitalVisitDao,
        HospitalVisitRelationDao,
        HospitalVisitTempDataDao
    ],
    exports: [
        HospitalVisitDao,
        HospitalVisitRelationDao,
        HospitalVisitTempDataDao
    ]
})
export class HospitalVisitPersistenceModule {
}
