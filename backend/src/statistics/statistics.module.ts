import {Module} from '@nestjs/common';
import {StatisticsService} from '@be/statistics/statistics.service';
import {StatisticsDao} from '@be/statistics/statistics.dao';
import {StatisticsController} from '@be/statistics/statistics.controller';

@Module({
    imports: [],
    controllers: [StatisticsController],
    providers: [StatisticsService, StatisticsDao],
    exports: [],
})
export class StatisticsModule {
}
