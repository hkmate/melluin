import {VisitsCountByWeekDay} from '@shared/statistics/visits-count-by-week-day';
import {AbstractStatisticWidgetController} from '@fe/app/statistics/controller/abstract-stat-widget-controller';
import {TranslateService} from '@ngx-translate/core';
import {WidgetMode} from '@fe/app/statistics/model/widget-mode';
import {ChartConfiguration} from 'chart.js';
import {ChartColor} from '@fe/app/util/chart/chart-color';
import {WidgetTableData} from '@fe/app/statistics/model/widget-data';
import {OperationCity} from '@shared/person/operation-city';
import {firstValueFrom} from 'rxjs';
import {VisitCountByWeekDayStatProvider} from '@fe/app/statistics/service/visit-count-by-week-day-stat-provider';

export type VisitsCountByWeekDayTableData = Omit<VisitsCountByWeekDay, 'weekDay' | 'visits' | 'visitMinutes'>
    & {
    visitHours: number,
    weekDay: string
};

export class VisitsCountByWeekDayStatController extends AbstractStatisticWidgetController<VisitsCountByWeekDayTableData> {

    constructor(translate: TranslateService, private readonly statProvider: VisitCountByWeekDayStatProvider) {
        super(translate, 'StatisticsPage.VisitsCountByWeekDay');
    }

    public override defaultMode(): WidgetMode {
        return WidgetMode.TABLE;
    }

    // eslint-disable-next-line max-lines-per-function
    public getChartData(): ChartConfiguration {
        const data = this.data();
        return {
            type: 'bar',
            data: {
                labels: data.map(x => x.weekDay),
                datasets: [
                    {
                        label: this.translate.instant('StatisticsPage.VisitsCountByWeekDay.VisitGroups'),
                        data: data.map(x => x.visitGroups),
                        backgroundColor: ChartColor.blue
                    },
                    {
                        label: this.translate.instant('StatisticsPage.VisitsCountByWeekDay.PureVisitGroups'),
                        data: data.map(x => x.pureVisitGroups),
                        backgroundColor: ChartColor.yellow
                    },
                    {
                        label: this.translate.instant('StatisticsPage.VisitsCountByWeekDay.VicariousMomVisit'),
                        data: data.map(x => x.vicariousMomVisit),
                        backgroundColor: ChartColor.purple
                    },
                    {
                        label: this.translate.instant('StatisticsPage.VisitsCountByWeekDay.CountedMinutes'),
                        data: data.map(x => x.visitHours),
                        backgroundColor: ChartColor.orange
                    }
                ]
            }
        } as ChartConfiguration;
    }

    public getTableData(): WidgetTableData<VisitsCountByWeekDayTableData> {
        return {
            headers: this.getHeaders(),
            data: this.data()
        }
    }

    protected async loadData(from: string, to: string, city: OperationCity): Promise<Array<VisitsCountByWeekDayTableData>> {
        const data = await firstValueFrom(this.statProvider.getVisitsCountByWeekDayStat(from, to, city));
        return this.prepareData(data);
    }

    /* eslint-disable @typescript-eslint/no-magic-numbers */
    private prepareData(original: Array<VisitsCountByWeekDay>): Array<VisitsCountByWeekDayTableData> {
        return original
            .map(vc => ({...vc, weekDay: (vc.weekDay !== 0 ? vc.weekDay : 7)})) // Move sunday to last
            .sort((a, b) => a.weekDay - b.weekDay)
            .map(vc => ({
                weekDay: this.translate.instant(`WeekDays.${vc.weekDay}`),
                visitGroups: vc.visitGroups,
                pureVisitGroups: vc.pureVisitGroups,
                vicariousMomVisit: vc.vicariousMomVisit,
                visitHours: vc.visitMinutes / 60,
            } satisfies VisitsCountByWeekDayTableData));
    }

    /* eslint-enable @typescript-eslint/no-magic-numbers */

    private getHeaders(): Record<keyof VisitsCountByWeekDayTableData, string> {
        return {
            weekDay: this.translate.instant('StatisticsPage.VisitsCountByWeekDay.WeekDay'),
            visitGroups: this.translate.instant('StatisticsPage.VisitsCountByWeekDay.VisitGroups'),
            pureVisitGroups: this.translate.instant('StatisticsPage.VisitsCountByWeekDay.PureVisitGroups'),
            vicariousMomVisit: this.translate.instant('StatisticsPage.VisitsCountByWeekDay.VicariousMomVisit'),
            visitHours: this.translate.instant('StatisticsPage.VisitsCountByWeekDay.CountedMinutes'),
        };
    }

}
