import {TranslateService} from '@ngx-translate/core';
import {WidgetTableData} from '@fe/app/statistics/model/widget-data';
import {ChartConfiguration} from 'chart.js';
import {ChildAgesByDepartments} from '@shared/statistics/child-ages-by-departments';
import {isNilOrEmpty} from '@shared/util/util';
import {OperationCity} from '@shared/person/operation-city';
import {firstValueFrom} from 'rxjs';
import {ChartColor} from '@fe/app/util/chart/chart-color';
import {AbstractStatisticWidgetController} from '@fe/app/statistics/controller/abstract-stat-widget-controller';
import {ChildAgesByDepartmentsStatProvider} from '@fe/app/statistics/service/child-ages-by-departments-stat-provider';

export type ChildAgesTableData = Omit<ChildAgesByDepartments, 'departmentId' | 'departmentName'>;

export class ChildAgesStatController extends AbstractStatisticWidgetController<ChildAgesTableData> {

    constructor(translate: TranslateService, private readonly statProvider: ChildAgesByDepartmentsStatProvider) {
        super(translate, 'StatisticsPage.ChildAges');
    }

    public getChartData(): ChartConfiguration {
        const sumOfChildren = this.data()?.[0]?.sum ?? 0;
        return {
            type: 'bar',
            data: {
                labels: Object.values(this.getHeadersWithoutSum()),
                datasets: [{
                    label: this.translate.instant('StatisticsPage.ChildAges.ChartBarLabel', {sum: sumOfChildren}),
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
            sum: this.translate.instant('StatisticsPage.ChildAges.Sum'),
            ...this.getHeadersWithoutSum()
        };
    }

    private getHeadersWithoutSum(): Record<keyof Omit<ChildAgesTableData, 'sum'>, string> {
        return {
            zeroToHalf: this.translate.instant('StatisticsPage.ChildAges.ZeroToHalf'),
            halfToOne: this.translate.instant('StatisticsPage.ChildAges.HalfToOne'),
            oneToThree: this.translate.instant('StatisticsPage.ChildAges.OneToThree'),
            threeToFive: this.translate.instant('StatisticsPage.ChildAges.ThreeToFive'),
            fiveToSeven: this.translate.instant('StatisticsPage.ChildAges.FiveToSeven'),
            sevenToNine: this.translate.instant('StatisticsPage.ChildAges.SevenToNine'),
            nineToEleven: this.translate.instant('StatisticsPage.ChildAges.NineToEleven'),
            elevenToThirteen: this.translate.instant('StatisticsPage.ChildAges.ElevenToThirteen'),
            thirteenToFifteen: this.translate.instant('StatisticsPage.ChildAges.ThirteenToFifteen'),
            fifteenToSeventeen: this.translate.instant('StatisticsPage.ChildAges.FifteenToSeventeen'),
            seventeenToUp: this.translate.instant('StatisticsPage.ChildAges.SeventeenToUp'),
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
