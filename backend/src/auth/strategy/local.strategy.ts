import {Strategy} from 'passport-local';
import {PassportStrategy} from '@nestjs/passport';
import {Injectable, UnauthorizedException} from '@nestjs/common';
import {AuthService} from '../service/auth.service';
import {User} from '../../user/user';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {

    constructor(private authService: AuthService) {
        super();
    }

    public async validate(username: string, password: string): Promise<User> {
        const user: User | null = await this.authService.validateUser(username, password) as User;
        // eslint-disable-next-line no-undefined
        if (user === null || user === undefined) {
            throw new UnauthorizedException();
        }
        return user;
    }

}
