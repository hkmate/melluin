import {Module} from '@nestjs/common';
import {PassportModule} from '@nestjs/passport';
import {JwtModule} from '@nestjs/jwt';
import {APP_GUARD} from '@nestjs/core';
import {UserModule} from '../user/user.module';
import {AuthService} from './service/auth.service';
import {JwtStrategy} from './strategy/jwt.strategy';
import {PasswordCryptService} from './service/password-crypt.service';
import {JwtAuthGuard} from './guard/jwt-auth.guard';
import {RolesGuard} from './guard/roles.guard';
import {LocalStrategy} from './strategy/local.strategy';
import {AuthController} from './auth.controller';
import * as CONFIG from '../../resources/server-config.json';
import {PersonModule} from '../person/person.module';

@Module({
    imports: [
        PersonModule,
        UserModule,
        PassportModule,
        JwtModule.register({
            secret: CONFIG.server.security.secretKey,
            signOptions: {
                expiresIn: CONFIG.server.security.expiration
            },
        }),
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        LocalStrategy,
        JwtStrategy,
        PasswordCryptService,
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
