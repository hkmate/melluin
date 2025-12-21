import {StatisticWidgetController} from '@fe/app/statistics/controller/widget-controller';
import {TranslateService} from '@ngx-translate/core';
import {StatisticsService} from '@fe/app/statistics/statistics.service';
import {WidgetExportingInfo, WidgetTableData} from '@fe/app/statistics/model/widget-data';
import {ChartConfiguration} from 'chart.js';
import {computed, Signal, signal} from '@angular/core';
import {isNilOrEmpty, isNotNil} from '@shared/util/util';
import {OperationCity} from '@shared/person/operation-city';
import {firstValueFrom} from 'rxjs';
import {ChildrenByDepartments} from '@shared/statistics/children-by-departments';
import {ChartColor} from '@fe/app/util/chart/chart-color';

export type ChildrenTableData = Omit<ChildrenByDepartments, 'departmentId' | 'departmentName'>;

export class ChildrenStatController implements StatisticWidgetController<ChildrenTableData> {

    protected readonly data = signal<Array<ChildrenTableData> | null>(null);
    private readonly ready = computed(() => isNotNil(this.data()));

    constructor(private readonly translate: TranslateService, private readonly statisticsService: StatisticsService) {
    }

    public hasData(): Signal<boolean> {
        return this.ready;
    }

    public async load(from: string, to: string, city: OperationCity): Promise<void> {
        const data = await firstValueFrom(this.statisticsService.getChildrenByDepartmentsStat(from, to, city));
        this.data.set(this.prepareData(data));
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

    public getExportingInfo(): WidgetExportingInfo<ChildrenTableData> {
        return {
            ...this.getTableData(),
            fileName: this.translate.instant('StatisticsPage.Children.ExportedFileName')
        }
    }

    public getName(): string {
        return this.translate.instant('StatisticsPage.Children.Title');
    }


    public getTableData(): WidgetTableData<ChildrenTableData> {
        return {
            headers: this.getHeaders(),
            data: this.data() ?? []
        }
    }

    private getHeaders(): Record<keyof ChildrenTableData, string> {
        return {
            childContact: this.translate.instant('StatisticsPage.Children.ChildContact'),
            child: this.translate.instant('StatisticsPage.Children.Child'),
            childWithRelativePresent: this.translate.instant('StatisticsPage.Children.ChildWithRelativePresent'),
        };
    }

    private prepareData(original: Array<ChildrenByDepartments>): Array<ChildrenTableData> {
        const summed = this.getZeroItem();
        for (const item of original) {
            summed.child += item.child;
            summed.childContact += item.childContact;
            summed.childWithRelativePresent += item.childWithRelativePresent;
        }
        return [summed];
    }

    private getZeroItem(): ChildrenTableData {
        return {
            child: 0,
            childContact: 0,
            childWithRelativePresent: 0
        };
    }

    private getChartDataset(): Array<number> {
        if (isNilOrEmpty(this.data())) {
            return [];
        }
        const [stat] = this.data()!;
        return [
            stat.childContact,
            stat.child,
            stat.childWithRelativePresent
        ];
    }

}
