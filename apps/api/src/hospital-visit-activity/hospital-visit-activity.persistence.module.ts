import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {FindOptionConverterModule} from '@be/find-option-converter/find-option-converter.module';
import {HospitalVisitActivityEntity} from '@be/hospital-visit-activity/model/hospital-visit-activity.entity';
import {HospitalVisitActivityDao} from '@be/hospital-visit-activity/hospital-visit-activity.dao';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            HospitalVisitActivityEntity
        ]),

        FindOptionConverterModule,
    ],
    providers: [
        HospitalVisitActivityDao,
    ],
    exports: [HospitalVisitActivityDao]
})
export class HospitalVisitActivityPersistenceModule {
}
