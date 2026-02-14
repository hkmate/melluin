import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {FindOptionConverterModule} from '@be/find-option-converter/find-option-converter.module';
import {ChildDao} from '@be/child/child.dao';
import {ChildEntity} from '@be/child/model/child.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            ChildEntity
        ]),

        FindOptionConverterModule,
    ],
    providers: [
        ChildDao
    ],
    exports: [
        ChildDao
    ]
})
export class ChildPersistenceModule {
}
