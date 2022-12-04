import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
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
    ],
    controllers: [AppController]
})
export class AppModule {
}
