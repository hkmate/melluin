import {Module} from '@nestjs/common';
import {PassportModule} from '@nestjs/passport';
import {JwtModule} from '@nestjs/jwt';
import {APP_GUARD} from '@nestjs/core';
import {UserModule} from '../user/user.module';
import {AuthService} from './service/auth.service';
import {JwtStrategy} from './strategy/jwt.strategy';
import {JwtAuthGuard} from './guard/jwt-auth.guard';
import {RolesGuard} from './guard/roles.guard';
import {AuthController} from './auth.controller';
import {PersonModule} from '../person/person.module';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {Security} from '@be/config/model/security';
import {UserEntityToDtoModule} from '@be/user/user-entity-to-dto.module';

@Module({
    imports: [
        ConfigModule,
        PassportModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: (config: ConfigService) => {
                const securityConfig = config.get<Security>('server.security');
                return {
                    secretOrPrivateKey: securityConfig?.secretKey,
                    signOptions: {
                        expiresIn: securityConfig?.expiration,
                    },
                };
            },
            inject: [ConfigService],
        }),

        PersonModule,
        UserModule,
        UserEntityToDtoModule,
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        JwtStrategy,
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        },
        {
            provide: APP_GUARD,
            useClass: RolesGuard,
        }
    ],
})
export class AuthModule {
}
