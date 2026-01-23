import {TranslateService} from '@ngx-translate/core';
import {WidgetTableData} from '@fe/app/statistics/model/widget-data';
import {ChartConfiguration} from 'chart.js';
import {isNilOrEmpty} from '@shared/util/util';
import {OperationCity} from '@shared/person/operation-city';
import {firstValueFrom} from 'rxjs';
import {ChartColor} from '@fe/app/util/chart/chart-color';
import {WidgetMode} from '@fe/app/statistics/model/widget-mode';
import {AbstractStatisticWidgetController} from '@fe/app/statistics/controller/abstract-stat-widget-controller';
import {VisitsCountByWeekDay} from '@shared/statistics/visits-count-by-week-day';
import {VisitCountByWeekDayStatProvider} from '@fe/app/statistics/service/visit-count-by-week-day-stat-provider';

export type VisitsCountTableData = Omit<VisitsCountByWeekDay, 'weekDay' | 'visits' | 'visitMinutes'>
    & { 'visitHours': number };

export class VisitsCountStatController extends AbstractStatisticWidgetController<VisitsCountTableData> {

    constructor(translate: TranslateService, private readonly statProvider: VisitCountByWeekDayStatProvider) {
        super(translate, 'StatisticsPage.VisitsCount');
    }

    public override defaultMode(): WidgetMode {
        return WidgetMode.TABLE;
    }

    public getChartData(): ChartConfiguration {
        return {
            type: 'bar',
            data: {
                labels: Object.values(this.getHeaders()),
                datasets: [{
                    data: this.getChartDataset(),
                    backgroundColor: ChartColor.blue,
                }]
            },
            options: {plugins: {legend: {display: false}}},
        } as ChartConfiguration;
    }

    public getTableData(): WidgetTableData<VisitsCountTableData> {
        return {
            headers: this.getHeaders(),
            data: this.data()
        }
    }

    protected async loadData(from: string, to: string, city: OperationCity): Promise<Array<VisitsCountTableData>> {
        const data = await firstValueFrom(this.statProvider.getVisitsCountByWeekDayStat(from, to, city));
        return this.prepareData(data);
    }

    private prepareData(original: Array<VisitsCountByWeekDay>): Array<VisitsCountTableData> {
        const summed = this.getZeroItem();
        for (const item of original) {
            summed.visitGroups += item.visitGroups;
            summed.pureVisitGroups += item.pureVisitGroups;
            summed.vicariousMomVisit += item.vicariousMomVisit;
            // eslint-disable-next-line @typescript-eslint/no-magic-numbers
            summed.visitHours += item.visitMinutes / 60;
        }
        return [summed];
    }

    private getZeroItem(): VisitsCountTableData {
        return {
            visitGroups: 0,
            pureVisitGroups: 0,
            vicariousMomVisit: 0,
            visitHours: 0
        };
    }

    private getHeaders(): Record<keyof VisitsCountTableData, string> {
        return {
            visitGroups: this.translate.instant('StatisticsPage.VisitsCount.VisitGroups'),
            pureVisitGroups: this.translate.instant('StatisticsPage.VisitsCount.PureVisitGroups'),
            vicariousMomVisit: this.translate.instant('StatisticsPage.VisitsCount.VicariousMomVisit'),
            visitHours: this.translate.instant('StatisticsPage.VisitsCount.CountedMinutes'),
        };
    }

    private getChartDataset(): Array<number> {
        if (isNilOrEmpty(this.data())) {
            return [];
        }
        const [stat] = this.data();
        return [
            stat.visitGroups,
            stat.pureVisitGroups,
            stat.vicariousMomVisit,
            stat.visitHours
        ];
    }

}
