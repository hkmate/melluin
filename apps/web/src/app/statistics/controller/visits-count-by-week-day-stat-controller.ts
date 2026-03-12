import {OperationCity, VisitsCountByWeekDay} from '@melluin/common';
import {AbstractStatisticWidgetController} from '@fe/app/statistics/controller/abstract-stat-widget-controller';
import {WidgetMode, WidgetModes} from '@fe/app/statistics/model/widget-mode';
import {ChartConfiguration} from 'chart.js';
import {ChartColor} from '@fe/app/util/chart/chart-color';
import {WidgetTableData} from '@fe/app/statistics/model/widget-data';
import {firstValueFrom} from 'rxjs';
import {VisitCountByWeekDayStatProvider} from '@fe/app/statistics/service/visit-count-by-week-day-stat-provider';
import {t} from '@fe/app/util/translate/translate';
import {I18nKeys} from '@fe/app/util/translate/i18n.type';

export type VisitsCountByWeekDayTableData = Omit<VisitsCountByWeekDay, 'weekDay' | 'visits' | 'visitMinutes'>
    & {
    visitHours: number,
    weekDay: string
};

export class VisitsCountByWeekDayStatController extends AbstractStatisticWidgetController<VisitsCountByWeekDayTableData> {

    constructor(private readonly statProvider: VisitCountByWeekDayStatProvider) {
        super('StatisticsPage.VisitsCountByWeekDay');
    }

    public override defaultMode(): WidgetMode {
        return WidgetModes.TABLE;
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
                        label: t('StatisticsPage.VisitsCountByWeekDay.VisitGroups'),
                        data: data.map(x => x.visitGroups),
                        backgroundColor: ChartColor.blue
                    },
                    {
                        label: t('StatisticsPage.VisitsCountByWeekDay.PureVisitGroups'),
                        data: data.map(x => x.pureVisitGroups),
                        backgroundColor: ChartColor.yellow
                    },
                    {
                        label: t('StatisticsPage.VisitsCountByWeekDay.VicariousMomVisit'),
                        data: data.map(x => x.vicariousMomVisit),
                        backgroundColor: ChartColor.purple
                    },
                    {
                        label: t('StatisticsPage.VisitsCountByWeekDay.CountedMinutes'),
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
                weekDay: t(`WeekDays.${vc.weekDay}` as I18nKeys),
                visitGroups: vc.visitGroups,
                pureVisitGroups: vc.pureVisitGroups,
                vicariousMomVisit: vc.vicariousMomVisit,
                visitHours: vc.visitMinutes / 60,
            } satisfies VisitsCountByWeekDayTableData));
    }

    /* eslint-enable @typescript-eslint/no-magic-numbers */

    private getHeaders(): Record<keyof VisitsCountByWeekDayTableData, string> {
        return {
            weekDay: t('StatisticsPage.VisitsCountByWeekDay.WeekDay'),
            visitGroups: t('StatisticsPage.VisitsCountByWeekDay.VisitGroups'),
            pureVisitGroups: t('StatisticsPage.VisitsCountByWeekDay.PureVisitGroups'),
            vicariousMomVisit: t('StatisticsPage.VisitsCountByWeekDay.VicariousMomVisit'),
            visitHours: t('StatisticsPage.VisitsCountByWeekDay.CountedMinutes'),
        };
    }

}
