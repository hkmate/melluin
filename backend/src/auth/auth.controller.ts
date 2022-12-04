import {Controller, HttpCode, HttpStatus, Post, Request, UseGuards} from '@nestjs/common';
import {AuthService} from './service/auth.service';
import {LocalAuthGuard} from './guard/local-auth.guard';
import {Public} from './decorator/public.decorator';
import {AuthToken} from '@shared/user/auth-token';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) {
    }

    @UseGuards(LocalAuthGuard)
    @Public()
    @HttpCode(HttpStatus.OK)
    @Post('/login')
    public login(@Request() req): AuthToken {
        return this.authService.getTokenFor(req.user);
    }

}
