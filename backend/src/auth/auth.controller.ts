import {Body, Controller, HttpCode, HttpStatus, Post} from '@nestjs/common';
import {AuthService} from './service/auth.service';
import {Public} from './decorator/public.decorator';
import {AuthToken} from '@shared/user/auth-token';
import {AuthCredentials} from '@shared/user/auth-credentials';
import {User} from '@shared/user/user';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) {
    }

    @Public()
    @HttpCode(HttpStatus.OK)
    @Post('/login')
    public async login(@Body() credentials: AuthCredentials): Promise<AuthToken> {
        const user: User = await this.authService.validate(credentials);
        return this.authService.getTokenFor(user);
    }

}
