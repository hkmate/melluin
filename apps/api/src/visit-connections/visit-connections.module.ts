import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {VisitEntity} from '@be/visit/model/visit.entity';
import {FindOptionConverterModule} from '@be/find-option-converter/find-option-converter.module';
import {VisitConnectionsController} from '@be/visit-connections/api/visit-connections.controller';
import {VisitConnectionsService} from '@be/visit-connections/visit-connections.service';
import {VisitModule} from '@be/visit/visit.module';
import {VisitConnectionsDao} from '@be/visit-connections/visit-connections.dao';
import {VisitPersistenceModule} from '@be/visit/visit.persistence.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            VisitEntity,
        ]),

        FindOptionConverterModule,
        VisitPersistenceModule,
        VisitModule
    ],
    providers: [VisitConnectionsService, VisitConnectionsDao],
    exports: [VisitConnectionsService],
    controllers: [VisitConnectionsController]
})
export class VisitConnectionsModule {
}
