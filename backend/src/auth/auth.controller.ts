import {Controller, Request, Post, UseGuards, Get} from '@nestjs/common';
import {AuthService} from './service/auth.service';
import {LocalAuthGuard} from './guard/local-auth.guard';
import {Public} from './decorator/public.decorator';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) {
    }

    @UseGuards(LocalAuthGuard)
    @Public()
    @Post('/login')
    async login(@Request() req) {
        return this.authService.login(req.user);
    }

    @Get('/me')
    getProfile(@Request() req) {
        return req.user;
    }
}
