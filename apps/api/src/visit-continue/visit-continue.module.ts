import {Module} from '@nestjs/common';
import {VisitModule} from '@be/visit/visit.module';
import {VisitContinueController} from '@be/visit-continue/api/visit-continue.controller';
import {VisitContinueService} from '@be/visit-continue/visit-continue.service';
import {VisitConnectionsModule} from '@be/visit-connections/visit-connections.module';
import {VisitPersistenceModule} from '@be/visit/visit.persistence.module';

@Module({
    imports: [
        VisitPersistenceModule,
        VisitModule,
        VisitConnectionsModule
    ],
    providers: [VisitContinueService],
    exports: [VisitContinueService],
    controllers: [VisitContinueController]
})
export class VisitContinueModule {
}
