import {Controller, Get} from '@nestjs/common';
import {Public} from './auth/decorator/public.decorator';
import {Roles} from './auth/decorator/roles.decorator';
import {Role} from './shared/user/role.enum';

@Controller()
export class AppController {

    @Public()
    @Get('/hi')
    public getHello(): string {
        return 'Hello Anonymous';
    }

    @Get('/hiUser')
    @Roles(Role.USER)
    public getHelloUser(): string {
        return 'Hello User';
    }

    @Get('/hiAdmin')
    @Roles(Role.SYSADMIN)
    public getHelloAdmin(): string {
        return 'Hello Admin';
    }

}
