import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {HospitalVisitEntity} from '@be/hospital-visit/model/hospital-visit.entity';
import {FindOptionConverterModule} from '@be/find-option-converter/find-option-converter.module';
import {HospitalVisitConnectionsController} from '@be/hospital-visit-connections/hospital-visit-connections.controller';
import {HospitalVisitConnectionsService} from '@be/hospital-visit-connections/hospital-visit-connections.service';
import {HospitalVisitModule} from '@be/hospital-visit/hospital-visit.module';
import {HospitalVisitConnectionsDao} from '@be/hospital-visit-connections/hospital-visit-connections.dao';
import {HospitalVisitPersistenceModule} from '@be/hospital-visit/hospital-visit.persistence.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            HospitalVisitEntity,
        ]),

        FindOptionConverterModule,
        HospitalVisitPersistenceModule,
        HospitalVisitModule
    ],
    providers: [HospitalVisitConnectionsService, HospitalVisitConnectionsDao],
    exports: [],
    controllers: [HospitalVisitConnectionsController]
})
export class HospitalVisitConnectionsModule {
}
