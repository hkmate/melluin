import {Module} from '@nestjs/common';
import {HospitalVisitModule} from '@be/hospital-visit/hospital-visit.module';
import {HospitalVisitContinueController} from '@be/hospital-visit-continue/hospital-visit-continue.controller';
import {HospitalVisitContinueService} from '@be/hospital-visit-continue/hospital-visit-continue.service';
import {HospitalVisitConnectionsModule} from '@be/hospital-visit-connections/hospital-visit-connections.module';
import {HospitalVisitPersistenceModule} from '@be/hospital-visit/hospital-visit.persistence.module';

@Module({
    imports: [
        HospitalVisitPersistenceModule,
        HospitalVisitModule,
        HospitalVisitConnectionsModule
    ],
    providers: [HospitalVisitContinueService],
    exports: [HospitalVisitContinueService],
    controllers: [HospitalVisitContinueController]
})
export class HospitalVisitContinueModule {
}
