import {WidgetTableData} from '@fe/app/statistics/model/widget-data';
import {ChartConfiguration} from 'chart.js';
import {ChildAgesByDepartments, isNilOrEmpty, OperationCity} from '@melluin/common';
import {firstValueFrom} from 'rxjs';
import {ChartColor} from '@fe/app/util/chart/chart-color';
import {AbstractStatisticWidgetController} from '@fe/app/statistics/controller/abstract-stat-widget-controller';
import {ChildAgesByDepartmentsStatProvider} from '@fe/app/statistics/service/child-ages-by-departments-stat-provider';
import {t} from '@fe/app/util/translate/translate';

export type ChildAgesTableData = Omit<ChildAgesByDepartments, 'departmentId' | 'departmentName'>;

export class ChildAgesStatController extends AbstractStatisticWidgetController<ChildAgesTableData> {

    constructor(private readonly statProvider: ChildAgesByDepartmentsStatProvider) {
        super('StatisticsPage.ChildAges');
    }

    public getChartData(): ChartConfiguration {
        const sumOfChildren = this.data()?.[0]?.sum ?? 0;
        return {
            type: 'bar',
            data: {
                labels: Object.values(this.getHeadersWithoutSum()),
                datasets: [{
                    label: t('StatisticsPage.ChildAges.ChartBarLabel', {sum: sumOfChildren}),
                    data: this.getChartDataset(),
                    backgroundColor: ChartColor.blue,
                    stack: 'stack 0'
                }]
            }
        } as ChartConfiguration;
    }

    public getTableData(): WidgetTableData<ChildAgesTableData> {
        return {
            headers: this.getHeaders(),
            data: this.data()
        }
    }

    protected async loadData(from: string, to: string, city: OperationCity): Promise<Array<ChildAgesTableData>> {
        const data = await firstValueFrom(this.statProvider.getChildAgesByDepartmentsStat(from, to, city));
        return this.prepareData(data);
    }

    private prepareData(original: Array<ChildAgesByDepartments>): Array<ChildAgesTableData> {
        const summed = original.reduce((sum, current) => {
            Object.keys(sum).forEach(key => {
                sum[key] += current[key];
            });
            return sum;
        }, this.getZeroItem());
        return [summed];
    }

    // eslint-disable-next-line max-lines-per-function
    private getZeroItem(): ChildAgesTableData {
        return {
            sum: 0,
            zeroToHalf: 0,
            halfToOne: 0,
            oneToThree: 0,
            threeToFive: 0,
            fiveToSeven: 0,
            sevenToNine: 0,
            nineToEleven: 0,
            elevenToThirteen: 0,
            thirteenToFifteen: 0,
            fifteenToSeventeen: 0,
            seventeenToUp: 0
        };
    }

    private getHeaders(): Record<keyof ChildAgesTableData, string> {
        return {
            sum: t('StatisticsPage.ChildAges.Sum'),
            ...this.getHeadersWithoutSum()
        };
    }

    private getHeadersWithoutSum(): Record<keyof Omit<ChildAgesTableData, 'sum'>, string> {
        return {
            zeroToHalf: t('StatisticsPage.ChildAges.ZeroToHalf'),
            halfToOne: t('StatisticsPage.ChildAges.HalfToOne'),
            oneToThree: t('StatisticsPage.ChildAges.OneToThree'),
            threeToFive: t('StatisticsPage.ChildAges.ThreeToFive'),
            fiveToSeven: t('StatisticsPage.ChildAges.FiveToSeven'),
            sevenToNine: t('StatisticsPage.ChildAges.SevenToNine'),
            nineToEleven: t('StatisticsPage.ChildAges.NineToEleven'),
            elevenToThirteen: t('StatisticsPage.ChildAges.ElevenToThirteen'),
            thirteenToFifteen: t('StatisticsPage.ChildAges.ThirteenToFifteen'),
            fifteenToSeventeen: t('StatisticsPage.ChildAges.FifteenToSeventeen'),
            seventeenToUp: t('StatisticsPage.ChildAges.SeventeenToUp'),
        };
    }

    // eslint-disable-next-line max-lines-per-function
    private getChartDataset(): Array<number> {
        if (isNilOrEmpty(this.data())) {
            return [];
        }
        const [stat] = this.data();
        return [
            stat.zeroToHalf,
            stat.halfToOne,
            stat.oneToThree,
            stat.threeToFive,
            stat.fiveToSeven,
            stat.sevenToNine,
            stat.nineToEleven,
            stat.elevenToThirteen,
            stat.thirteenToFifteen,
            stat.fifteenToSeventeen,
            stat.seventeenToUp
        ];
    }

}
