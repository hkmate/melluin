import {StatisticWidgetController} from '@fe/app/statistics/controller/widget-controller';
import {TranslateService} from '@ngx-translate/core';
import {StatisticsService} from '@fe/app/statistics/statistics.service';
import {WidgetExportingInfo, WidgetTableData} from '@fe/app/statistics/model/widget-data';
import {ChartConfiguration} from 'chart.js';
import {computed, Signal, signal} from '@angular/core';
import {isNotNil} from '@shared/util/util';
import {OperationCity} from '@shared/person/operation-city';
import {firstValueFrom} from 'rxjs';
import {ChildrenByDepartments} from '@shared/statistics/children-by-departments';

export type ChildrenByDepartmentsTableData = Omit<ChildrenByDepartments, 'departmentId'>;

export class ChildrenByDepartmentsStatController implements StatisticWidgetController<ChildrenByDepartmentsTableData> {

    protected readonly data = signal<Array<ChildrenByDepartmentsTableData> | null>(null);
    private readonly ready = computed(() => isNotNil(this.data()));

    constructor(private readonly translate: TranslateService, private readonly statisticsService: StatisticsService) {
    }

    public hasData(): Signal<boolean> {
        return this.ready;
    }

    public async load(from: string, to: string, city: OperationCity): Promise<void> {
        const data = await firstValueFrom(this.statisticsService.getChildrenByDepartmentsStat(from, to, city));
        this.data.set(data);
    }

    public getChartData(): ChartConfiguration {
        return {
            type: 'bar',
            data: {
                // datasets: this.data() ?? []
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
