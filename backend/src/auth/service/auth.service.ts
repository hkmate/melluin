import {Injectable} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {UserService} from '../../user/user.service';
import {PasswordCryptService} from './password-crypt.service';
import {User} from '../../user/user';

@Injectable()
export class AuthService {

    constructor(private readonly jwtService: JwtService,
                private readonly userService: UserService,
                private readonly passwordCryptService: PasswordCryptService) {
    }

    public async validateUser(username: string, pass: string): Promise<unknown> {
        const user = await this.userService.findOne(username);

        if (!user) {
            return null;
        }

        if (this.passwordCryptService.match(pass, user.password)) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const {password, ...result} = user;
            return result;
        }
        return null;
    }

    public login(user: User): { access_token: string } {
        return {
            access_token: this.jwtService.sign({user}),
        };
    }

}
