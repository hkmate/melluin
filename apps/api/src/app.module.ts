import {Module} from '@nestjs/common';
import {AuthModule} from './auth/auth.module';
import {UserModule} from './user/user.module';
import {TypeOrmModuleDefinition} from './typeorm.module';
import {ConfigModuleDefinition} from '@be/config/config.module';
import {PersonModule} from '@be/person/person.module';
import {DepartmentModule} from '@be/department/department.module';
import {HospitalVisitModule} from '@be/hospital-visit/hospital-visit.module';
import {ChildModule} from '@be/child/child.module';
import {HospitalVisitActivityModule} from '@be/hospital-visit-activity/hospital-visit-activity.module';
import {HealthCheckModule} from '@be/health-check/health-check.module';
import {StatisticsModule} from '@be/statistics/statistics.module';
import {HospitalVisitConnectionsModule} from '@be/hospital-visit-connections/hospital-visit-connections.module';
import {HospitalVisitContinueModule} from '@be/hospital-visit-continue/hospital-visit-continue.module';

@Module({
    imports: [
        ConfigModuleDefinition,
        TypeOrmModuleDefinition,

        HealthCheckModule,
        AuthModule,
        UserModule,
        PersonModule,
        DepartmentModule,
        HospitalVisitModule,
        HospitalVisitActivityModule,
        HospitalVisitConnectionsModule,
        HospitalVisitContinueModule,
        ChildModule,
        StatisticsModule
    ]
})
export class AppModule {
}
