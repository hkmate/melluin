import {OperationCity, VisitsCountByWeekDay} from '@melluin/common';
import {Observable, shareReplay} from 'rxjs';
import {inject, Injectable} from '@angular/core';
import {StatisticsService} from '@fe/app/statistics/service/statistics.service';
import {isEqual} from 'lodash-es';

export interface VisitCountByWeekDayStatProvider {
    getVisitsCountByWeekDayStat(from: string, to: string, city: OperationCity): Observable<Array<VisitsCountByWeekDay>>;
}

@Injectable()
export class VisitCountByWeekDayStatProviderService implements VisitCountByWeekDayStatProvider {

    private readonly statisticsService = inject(StatisticsService);

    private activeFilter: Array<string> | null = null;
    private request: Observable<Array<VisitsCountByWeekDay>> | null = null;

    public getVisitsCountByWeekDayStat(from: string, to: string, city: OperationCity): Observable<Array<VisitsCountByWeekDay>> {
        const newFilter = [from, to, city];
        if (isEqual(this.activeFilter, newFilter)) {
            return this.request!
        }

        this.activeFilter = newFilter;
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        this.request = this.statisticsService.getVisitsCountByWeekDayStat(from, to, city).pipe(shareReplay(10));
        return this.request;
    }

}
