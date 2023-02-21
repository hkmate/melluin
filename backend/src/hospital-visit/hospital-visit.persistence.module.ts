import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {FindOptionConverterModule} from '@be/find-option-converter/find-option-converter.module';
import {HospitalVisitEntity} from '@be/hospital-visit/model/hospital-visit.entity';
import {HospitalVisitDao} from '@be/hospital-visit/hospital-visit.dao';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            HospitalVisitEntity
        ]),

        FindOptionConverterModule,
    ],
    providers: [
        HospitalVisitDao,
    ],
    exports: [HospitalVisitDao]
})
export class HospitalVisitPersistenceModule {
}
