import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {FindOptionConverterModule} from '@be/find-option-converter/find-option-converter.module';
import {VisitActivityEntity} from '@be/visit-activity/model/visit-activity.entity';
import {VisitActivityDao} from '@be/visit-activity/visit-activity.dao';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            VisitActivityEntity
        ]),

        FindOptionConverterModule,
    ],
    providers: [
        VisitActivityDao,
    ],
    exports: [VisitActivityDao]
})
export class VisitActivityPersistenceModule {
}
