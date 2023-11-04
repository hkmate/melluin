import {Body, Controller, HttpCode, HttpStatus, Post} from '@nestjs/common';
import {AuthService} from './service/auth.service';
import {Public} from './decorator/public.decorator';
import {AuthInfo} from '@shared/user/auth-info';
import {AuthCredentials} from '@shared/user/auth-credentials';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) {
    }

    @Public()
    @HttpCode(HttpStatus.OK)
    @Post('/login')
    public async login(@Body() credentials: AuthCredentials): Promise<AuthInfo> {
        await this.authService.validate(credentials);
        return this.authService.getTokenFor(credentials);
    }

}
