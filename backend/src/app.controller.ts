import {Controller, Get} from '@nestjs/common';
import {Public} from './auth/decorator/public.decorator';
import {Roles} from './auth/decorator/roles.decorator';
import {Role} from './auth/constant/role.enum';

@Controller()
export class AppController {

    @Public()
    @Get('/hi')
    getHello(): string {
        return 'Hello Anonymous';
    }

    @Get('/hiUser')
    @Roles(Role.USER)
    getHelloUser(): string {
        return 'Hello User';
    }

    @Get('/hiAdmin')
    @Roles(Role.SYSADMIN)
    getHelloAdmin(): string {
        return 'Hello Admin';
    }
}
