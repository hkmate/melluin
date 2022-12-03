import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AuthModule} from './auth/auth.module';
import {UserModule} from './user/user.module';
import {TypeOrmModuleDefinition} from './typeorm.module';

@Module({
    imports: [
        AuthModule,
        UserModule,
        TypeOrmModuleDefinition
    ],
    controllers: [AppController]
})
export class AppModule {
}
