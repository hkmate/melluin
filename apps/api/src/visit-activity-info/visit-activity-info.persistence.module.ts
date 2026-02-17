import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {VisitActivityInfoEntity} from '@be/visit-activity-info/model/visit-activity-info.entity';
import {VisitActivityInfoDao} from '@be/visit-activity-info/visit-activity-info.dao';
import {VisitPersistenceModule} from '@be/visit/visit.persistence.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            VisitActivityInfoEntity
        ]),

        VisitPersistenceModule
    ],
    providers: [
        VisitActivityInfoDao,
    ],
    exports: [VisitActivityInfoDao]
})
export class VisitActivityInfoPersistenceModule {
}
