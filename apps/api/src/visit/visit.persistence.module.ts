import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {FindOptionConverterModule} from '@be/find-option-converter/find-option-converter.module';
import {VisitEntity} from '@be/visit/model/visit.entity';
import {VisitDao} from '@be/visit/visit.dao';
import {VisitRelationDao} from '@be/visit/visit-relation.dao';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            VisitEntity,
        ]),

        FindOptionConverterModule,
    ],
    providers: [
        VisitDao,
        VisitRelationDao,
    ],
    exports: [
        VisitDao,
        VisitRelationDao,
    ]
})
export class VisitPersistenceModule {
}
