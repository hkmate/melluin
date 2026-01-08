import {StatisticWidgetController} from '@fe/app/statistics/controller/widget-controller';
import {TranslateService} from '@ngx-translate/core';
import {WidgetExportingInfo, WidgetTableData} from '@fe/app/statistics/model/widget-data';
import {ChartConfiguration} from 'chart.js';
import {Signal, signal} from '@angular/core';
import {OperationCity} from '@shared/person/operation-city';
import {firstValueFrom} from 'rxjs';
import {ChildAgesByDepartments} from '@shared/statistics/child-ages-by-departments';
import {ChartDataset} from 'chart.js/dist/types';
import {ChartColor} from '@fe/app/util/chart/chart-color';
import {ChildAgesByDepartmentsStatProviderService} from '@fe/app/statistics/service/child-ages-by-departments-stat-provider';
import {WidgetMode} from '@fe/app/statistics/model/widget-mode';


export type ChildAgesByDepartmentsTableData = Omit<ChildAgesByDepartments, 'departmentId'>;
type AgesKeys = keyof Omit<ChildAgesByDepartmentsTableData, 'departmentName' | 'sum'>;

export class ChildAgesByDepartmentsStatController implements StatisticWidgetController<ChildAgesByDepartmentsTableData> {

    protected readonly data = signal<Array<ChildAgesByDepartmentsTableData>>([]);
    private readonly ready = signal(false);

    constructor(private readonly translate: TranslateService, private readonly providerService: ChildAgesByDepartmentsStatProviderService) {
    }

    public hasData(): Signal<boolean> {
        return this.ready;
    }

    public defaultMode(): WidgetMode {
        return WidgetMode.CHART;
    }

    public async load(from: string, to: string, city: OperationCity): Promise<void> {
        const data = await firstValueFrom(this.providerService.getChildAgesByDepartmentsStat(from, to, city));
        this.data.set(data);
        this.ready.set(true);
    }

    public getExportingInfo(): WidgetExportingInfo<ChildAgesByDepartmentsTableData> {
        return {
            ...this.getTableData(),
            fileName: this.translate.instant('StatisticsPage.ChildAgesByDepartments.ExportedFileName')
        }
    }

    public getName(): string {
        return this.translate.instant('StatisticsPage.ChildAgesByDepartments.Title');
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
