import {Strategy} from 'passport-local';
import {PassportStrategy} from '@nestjs/passport';
import {Injectable} from '@nestjs/common';
import {AuthService} from '../service/auth.service';
import {User} from '@shared/user/user';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {

    constructor(private authService: AuthService) {
        super();
    }

    public validate(username: string, password: string): Promise<User> {
        return this.authService.validateUser(username, password);
    }

}
