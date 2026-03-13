import {Module} from '@nestjs/common';
import {AuthModule} from './auth/auth.module';
import {UserModule} from './user/user.module';
import {TypeOrmModuleDefinition} from './typeorm.module';
import {ConfigModuleDefinition} from '@be/config/config.module';
import {PersonModule} from '@be/person/person.module';
import {DepartmentModule} from '@be/department/department.module';
import {VisitModule} from '@be/visit/visit.module';
import {ChildModule} from '@be/child/child.module';
import {VisitActivityModule} from '@be/visit-activity/visit-activity.module';
import {HealthCheckModule} from '@be/health-check/health-check.module';
import {StatisticsModule} from '@be/statistics/statistics.module';
import {VisitConnectionsModule} from '@be/visit-connections/visit-connections.module';
import {VisitContinueModule} from '@be/visit-continue/visit-continue.module';
import {ThrottlerGuard, ThrottlerModule} from '@nestjs/throttler';
import {APP_GUARD} from '@nestjs/core';

@Module({
    imports: [
        ConfigModuleDefinition,
        TypeOrmModuleDefinition,
        ThrottlerModule.forRoot({
            throttlers: [{ttl: 5_000, limit: 10}]
        }),

        HealthCheckModule,
        AuthModule,
        UserModule,
        PersonModule,
        DepartmentModule,
        VisitModule,
        VisitActivityModule,
        VisitConnectionsModule,
        VisitContinueModule,
        ChildModule,
        StatisticsModule
    ],
    providers: [
        {provide: APP_GUARD, useClass: ThrottlerGuard}
    ]
})
export class AppModule {
}
