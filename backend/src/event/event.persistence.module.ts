import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {FindOptionConverterModule} from '@be/find-option-converter/find-option-converter.module';
import {EventEntity} from '@be/event/model/event.entity';
import {EventDao} from '@be/event/event.dao';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            EventEntity
        ]),

        FindOptionConverterModule,
    ],
    providers: [
        EventDao,
    ],
    exports: [EventDao]
})
export class EventPersistenceModule {
}
