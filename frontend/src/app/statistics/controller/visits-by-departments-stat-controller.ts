import {StatisticWidgetController} from '@fe/app/statistics/controller/widget-controller';
import {TranslateService} from '@ngx-translate/core';
import {StatisticsService} from '@fe/app/statistics/statistics.service';
import {WidgetExportingInfo, WidgetTableData} from '@fe/app/statistics/model/widget-data';
import {ChartConfiguration} from 'chart.js';
import {computed, Signal, signal} from '@angular/core';
import {isNotNil} from '@shared/util/util';
import {OperationCity} from '@shared/person/operation-city';
import {firstValueFrom} from 'rxjs';
import {VisitByDepartments} from '@shared/statistics/visit-by-departments';

export type VisitByDepartmentsTableData = Omit<VisitByDepartments, 'departmentId' | 'visitMinutes'> & {
    'visitHours': number
};

export class VisitsByDepartmentsStatController implements StatisticWidgetController<VisitByDepartmentsTableData> {

    protected readonly data = signal<Array<VisitByDepartmentsTableData> | null>(null);
    private readonly ready = computed(() => isNotNil(this.data()));

    constructor(private readonly translate: TranslateService, private readonly statisticsService: StatisticsService) {
    }

    public hasData(): Signal<boolean> {
        return this.ready;
    }

    public async load(from: string, to: string, city: OperationCity): Promise<void> {
        const data = await firstValueFrom(this.statisticsService.getVisitsByDepartmentsStat(from, to, city));
        this.data.set(data.map(this.prepareData.bind(this)));
    }

    public getChartData(): ChartConfiguration {
        return {
            type: 'bar',
            data: {
                // datasets: this.data() ?? []
            }
        } as ChartConfiguration;
    }

    public getExportingInfo(): WidgetExportingInfo<VisitByDepartmentsTableData> {
        return {
            ...this.getTableData(),
            fileName: this.translate.instant('StatisticsPage.VisitsByDepartments.ExportedFileName')
        }
    }

    public getName(): string {
        return this.translate.instant('StatisticsPage.VisitsByDepartments.Title');
    }


    public getTableData(): WidgetTableData<VisitByDepartmentsTableData> {
        return {
            headers: {
                departmentName: this.translate.instant('StatisticsPage.VisitsByDepartments.DepartmentName'),
                visitCount: this.translate.instant('StatisticsPage.VisitsByDepartments.VisitCount'),
                visitHours: this.translate.instant('StatisticsPage.VisitsByDepartments.VisitHours'),
            },
            data: this.data() ?? []
        }
    }

    private prepareData(original: VisitByDepartments): VisitByDepartmentsTableData {
        return {
            departmentName: original.departmentName,
            visitCount: original.visitCount,
            // eslint-disable-next-line @typescript-eslint/no-magic-numbers
            visitHours: original.visitMinutes / 60
        };
    }

}
