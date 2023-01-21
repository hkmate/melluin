import {Module} from '@nestjs/common';
import {AuthModule} from './auth/auth.module';
import {UserModule} from './user/user.module';
import {TypeOrmModuleDefinition} from './typeorm.module';
import {ConfigModuleDefinition} from '@be/config/config.module';

@Module({
    imports: [
        ConfigModuleDefinition,
        TypeOrmModuleDefinition,

        AuthModule,
        UserModule
    ]
})
export class AppModule {
}
