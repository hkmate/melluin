import {Injectable} from '@nestjs/common';
import {PassportStrategy} from '@nestjs/passport';
import {ExtractJwt, Strategy} from 'passport-jwt';
import * as CONFIG from '@resources/server-config.json';
import {User} from '@shared/user/user';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: CONFIG.server.security.secretKey,
        });
    }

    public validate(payload: { user: User }): User {
        return payload.user;
    }

}
