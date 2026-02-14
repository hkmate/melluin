import {Controller, Get} from '@nestjs/common';
import {Public} from '@be/auth/decorator/public.decorator';


@Controller('health')
export class HealthCheckController {

    @Get()
    @Public()
    public check(): string {
        // TODO: create a proper health checker.
        return 'I\'m fine, thanks!';
    }

}
