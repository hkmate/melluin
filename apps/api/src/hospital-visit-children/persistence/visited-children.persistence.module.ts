import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {FindOptionConverterModule} from '@be/find-option-converter/find-option-converter.module';
import {VisitedChildEntity} from '@be/hospital-visit-children/persistence/model/visited-child.entity';
import {VisitedChildrenDao} from '@be/hospital-visit-children/persistence/visited-children.dao';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            VisitedChildEntity,
        ]),

        FindOptionConverterModule,
    ],
    providers: [
        VisitedChildrenDao
    ],
    exports: [
        VisitedChildrenDao
    ]
})
export class VisitedChildrenPersistenceModule {
}
