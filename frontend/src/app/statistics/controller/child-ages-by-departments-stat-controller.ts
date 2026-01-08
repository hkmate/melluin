import {TranslateService} from '@ngx-translate/core';
import {WidgetTableData} from '@fe/app/statistics/model/widget-data';
import {ChartConfiguration} from 'chart.js';
import {OperationCity} from '@shared/person/operation-city';
import {firstValueFrom} from 'rxjs';
import {ChildAgesByDepartments} from '@shared/statistics/child-ages-by-departments';
import {ChartDataset} from 'chart.js/dist/types';
import {ChartColor} from '@fe/app/util/chart/chart-color';
import {AbstractStatisticWidgetController} from '@fe/app/statistics/controller/abstract-stat-widget-controller';
import {ChildAgesByDepartmentsStatProvider} from '@fe/app/statistics/service/child-ages-by-departments-stat-provider';


export type ChildAgesByDepartmentsTableData = Omit<ChildAgesByDepartments, 'departmentId'>;
type AgesKeys = keyof Omit<ChildAgesByDepartmentsTableData, 'departmentName' | 'sum'>;

export class ChildAgesByDepartmentsStatController extends AbstractStatisticWidgetController<ChildAgesByDepartmentsTableData> {

    constructor(translate: TranslateService, private readonly statProvider: ChildAgesByDepartmentsStatProvider) {
        super(translate, 'StatisticsPage.ChildAgesByDepartments');
    }

    public getTableData(): WidgetTableData<ChildAgesByDepartmentsTableData> {
        return {
            headers: {
                departmentName: this.translate.instant('StatisticsPage.ChildAgesByDepartments.departmentName'),
                sum: this.translate.instant('StatisticsPage.ChildAgesByDepartments.Sum'),
                ...this.getHeadersForAges()
            },
            data: this.data()
        }
    }

    public getChartData(): ChartConfiguration {
        const ages = Object.entries(this.getHeadersForAges()) as Array<[AgesKeys, string]>
        const colors = Object.values(ChartColor);
        return {
            type: 'bar',
            data: {
                labels: this.data().map(x => x.departmentName),
                datasets: ages.map(([field, label], index) => this.createDataset(field, label, colors[index])),
            }
        } as ChartConfiguration;
    }

    protected loadData(from: string, to: string, city: OperationCity): Promise<Array<ChildAgesByDepartmentsTableData>> {
        return firstValueFrom(this.statProvider.getChildAgesByDepartmentsStat(from, to, city));
    }

    private createDataset(field: AgesKeys, label: string, color: string): ChartDataset {
        return {
            label,
            backgroundColor: color,
            data: this.data().map(x => x[field]),
            stack: 'stack 0'
        }
    }

    private getHeadersForAges(): Record<AgesKeys, string> {
        return {
            zeroToHalf: this.translate.instant('StatisticsPage.ChildAgesByDepartments.ZeroToHalf'),
            halfToOne: this.translate.instant('StatisticsPage.ChildAgesByDepartments.HalfToOne'),
            oneToThree: this.translate.instant('StatisticsPage.ChildAgesByDepartments.OneToThree'),
            threeToFive: this.translate.instant('StatisticsPage.ChildAgesByDepartments.ThreeToFive'),
            fiveToSeven: this.translate.instant('StatisticsPage.ChildAgesByDepartments.FiveToSeven'),
            sevenToNine: this.translate.instant('StatisticsPage.ChildAgesByDepartments.SevenToNine'),
            nineToEleven: this.translate.instant('StatisticsPage.ChildAgesByDepartments.NineToEleven'),
            elevenToThirteen: this.translate.instant('StatisticsPage.ChildAgesByDepartments.ElevenToThirteen'),
            thirteenToFifteen: this.translate.instant('StatisticsPage.ChildAgesByDepartments.ThirteenToFifteen'),
            fifteenToSeventeen: this.translate.instant('StatisticsPage.ChildAgesByDepartments.FifteenToSeventeen'),
            seventeenToUp: this.translate.instant('StatisticsPage.ChildAgesByDepartments.SeventeenToUp'),
        };
    }


}
