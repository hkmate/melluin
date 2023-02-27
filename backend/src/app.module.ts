import {Module} from '@nestjs/common';
import {AuthModule} from './auth/auth.module';
import {UserModule} from './user/user.module';
import {TypeOrmModuleDefinition} from './typeorm.module';
import {ConfigModuleDefinition} from '@be/config/config.module';
import {PersonModule} from '@be/person/person.module';
import {DepartmentModule} from '@be/department/department.module';
import {HospitalVisitModule} from '@be/hospital-visit/hospital-visit.module';

@Module({
    imports: [
        ConfigModuleDefinition,
        TypeOrmModuleDefinition,

        AuthModule,
        UserModule,
        PersonModule,
        DepartmentModule,
        HospitalVisitModule
    ]
})
export class AppModule {
}
