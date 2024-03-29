import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {FindOptionConverterModule} from '@be/find-option-converter/find-option-converter.module';
import {HospitalVisitEntity} from '@be/hospital-visit/model/hospital-visit.entity';
import {HospitalVisitDao} from '@be/hospital-visit/hospital-visit.dao';
import {HospitalVisitRelationDao} from '@be/hospital-visit/hospital-visit-relation.dao';
@Module({
    imports: [
        TypeOrmModule.forFeature([
            HospitalVisitEntity,
        ]),

        FindOptionConverterModule,
    ],
    providers: [
        HospitalVisitDao,
        HospitalVisitRelationDao,
    ],
    exports: [
        HospitalVisitDao,
        HospitalVisitRelationDao,
    ]
})
export class HospitalVisitPersistenceModule {
}
