import {Injectable} from '@nestjs/common';
import {PassportStrategy} from '@nestjs/passport';
import {ExtractJwt, Strategy} from 'passport-jwt';
import {User} from '@shared/user/user';
import {ConfigService} from '@nestjs/config';
import {JwtUserStorage} from '@be/auth/strategy/jwt-user-storage';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor(private readonly userStorage: JwtUserStorage,
                config: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: config.get('server.security.secretKey')!,
        });
    }

    public validate({userId}: { userId: string }): Promise<User> {
        return this.userStorage.getById(userId);
    }

}
