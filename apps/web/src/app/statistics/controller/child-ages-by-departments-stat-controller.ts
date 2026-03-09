import {WidgetTableData} from '@fe/app/statistics/model/widget-data';
import {ChartConfiguration, ChartDataset} from 'chart.js';
import {ChildAgesByDepartments, OperationCity} from '@melluin/common';
import {firstValueFrom} from 'rxjs';
import {ChartColor} from '@fe/app/util/chart/chart-color';
import {AbstractStatisticWidgetController} from '@fe/app/statistics/controller/abstract-stat-widget-controller';
import {ChildAgesByDepartmentsStatProvider} from '@fe/app/statistics/service/child-ages-by-departments-stat-provider';
import {t} from '@fe/app/util/translate/translate';


export type ChildAgesByDepartmentsTableData = Omit<ChildAgesByDepartments, 'departmentId'>;
type AgesKeys = keyof Omit<ChildAgesByDepartmentsTableData, 'departmentName' | 'sum'>;

export class ChildAgesByDepartmentsStatController extends AbstractStatisticWidgetController<ChildAgesByDepartmentsTableData> {

    constructor(private readonly statProvider: ChildAgesByDepartmentsStatProvider) {
        super('StatisticsPage.ChildAgesByDepartments');
    }

    public getTableData(): WidgetTableData<ChildAgesByDepartmentsTableData> {
        return {
            headers: {
                departmentName: t('StatisticsPage.ChildAgesByDepartments.DepartmentName'),
                sum: t('StatisticsPage.ChildAgesByDepartments.Sum'),
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
            zeroToHalf: t('StatisticsPage.ChildAgesByDepartments.ZeroToHalf'),
            halfToOne: t('StatisticsPage.ChildAgesByDepartments.HalfToOne'),
            oneToThree: t('StatisticsPage.ChildAgesByDepartments.OneToThree'),
            threeToFive: t('StatisticsPage.ChildAgesByDepartments.ThreeToFive'),
            fiveToSeven: t('StatisticsPage.ChildAgesByDepartments.FiveToSeven'),
            sevenToNine: t('StatisticsPage.ChildAgesByDepartments.SevenToNine'),
            nineToEleven: t('StatisticsPage.ChildAgesByDepartments.NineToEleven'),
            elevenToThirteen: t('StatisticsPage.ChildAgesByDepartments.ElevenToThirteen'),
            thirteenToFifteen: t('StatisticsPage.ChildAgesByDepartments.ThirteenToFifteen'),
            fifteenToSeventeen: t('StatisticsPage.ChildAgesByDepartments.FifteenToSeventeen'),
            seventeenToUp: t('StatisticsPage.ChildAgesByDepartments.SeventeenToUp'),
        };
    }


}
