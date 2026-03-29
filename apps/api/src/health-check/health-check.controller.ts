import {Controller, Get} from '@nestjs/common';
import {Public} from '@be/auth/decorator/public.decorator';
import {Throttle} from '@nestjs/throttler';

@Throttle({default: {limit: 10, ttl: 60 * 1000}})
@Controller('health')
export class HealthCheckController {

    @Get()
    @Public()
    public check(): string {
        // TODO: create a proper health checker.
        return 'I\'m fine, thanks!';
    }

}
