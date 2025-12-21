import {StatisticWidgetController} from '@fe/app/statistics/controller/widget-controller';
import {TranslateService} from '@ngx-translate/core';
import {WidgetExportingInfo, WidgetTableData} from '@fe/app/statistics/model/widget-data';
import {ChartConfiguration} from 'chart.js';
import {computed, Signal, signal} from '@angular/core';
import {isNotNil} from '@shared/util/util';
import {OperationCity} from '@shared/person/operation-city';
import {firstValueFrom} from 'rxjs';
import {ChildrenByDepartments} from '@shared/statistics/children-by-departments';
import {ChartColor} from '@fe/app/util/chart/chart-color';
import {ChildrenByDepartmentsStatProvider} from '@fe/app/statistics/service/children-by-departments-stat-provider';

export type ChildrenByDepartmentsTableData = Omit<ChildrenByDepartments, 'departmentId'>;

export class ChildrenByDepartmentsStatController implements StatisticWidgetController<ChildrenByDepartmentsTableData> {

    protected readonly data = signal<Array<ChildrenByDepartmentsTableData> | null>(null);
    private readonly ready = computed(() => isNotNil(this.data()));

    constructor(private readonly translate: TranslateService, private readonly statProvider: ChildrenByDepartmentsStatProvider) {
    }

    public hasData(): Signal<boolean> {
        return this.ready;
    }

    public async load(from: string, to: string, city: OperationCity): Promise<void> {
        const data = await firstValueFrom(this.statProvider.getChildrenByDepartmentsStat(from, to, city));
        this.data.set(data);
    }

    // eslint-disable-next-line max-lines-per-function
    public getChartData(): ChartConfiguration {
        const data = this.data() ?? [];
        return {
            type: 'bar',
            data: {
                labels: data.map(x => x.departmentName),
                datasets: [
                    {
                        label: this.translate.instant('StatisticsPage.ChildrenByDepartments.ChildContact'),
                        data: data.map(x => x.childContact),
                        backgroundColor: ChartColor.yellow,
                        stack: 'stack 0'
                    },
                    {
                        label: this.translate.instant('StatisticsPage.ChildrenByDepartments.Child'),
                        data: data.map(x => x.child),
                        backgroundColor: ChartColor.blue,
                        stack: 'stack 1'
                    },
                    {
                        label: this.translate.instant('StatisticsPage.ChildrenByDepartments.ChildWithRelativePresent'),
                        data: data.map(x => x.childWithRelativePresent),
                        backgroundColor: ChartColor.purple,
                        stack: 'stack 2'
                    }
                ]
            }
        } as ChartConfiguration;
    }

    public getExportingInfo(): WidgetExportingInfo<ChildrenByDepartmentsTableData> {
        return {
            ...this.getTableData(),
            fileName: this.translate.instant('StatisticsPage.ChildrenByDepartments.ExportedFileName')
        }
    }

    public getName(): string {
        return this.translate.instant('StatisticsPage.ChildrenByDepartments.Title');
    }


    public getTableData(): WidgetTableData<ChildrenByDepartmentsTableData> {
        return {
            headers: {
                departmentName: this.translate.instant('StatisticsPage.ChildrenByDepartments.DepartmentName'),
                childContact: this.translate.instant('StatisticsPage.ChildrenByDepartments.ChildContact'),
                child: this.translate.instant('StatisticsPage.ChildrenByDepartments.Child'),
                childWithRelativePresent: this.translate.instant('StatisticsPage.ChildrenByDepartments.ChildWithRelativePresent'),
            },
            data: this.data() ?? []
        }
    }

}
