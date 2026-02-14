import {TranslateService} from '@ngx-translate/core';
import {StatisticsService} from '@fe/app/statistics/service/statistics.service';
import {WidgetTableData} from '@fe/app/statistics/model/widget-data';
import {ChartConfiguration} from 'chart.js';
import {OperationCity} from '@shared/person/operation-city';
import {firstValueFrom} from 'rxjs';
import {VisitByDepartments} from '@shared/statistics/visit-by-departments';
import {ChartColor} from '@fe/app/util/chart/chart-color';
import {AbstractStatisticWidgetController} from '@fe/app/statistics/controller/abstract-stat-widget-controller';

export type VisitByDepartmentsTableData = Omit<VisitByDepartments, 'departmentId' | 'visitMinutes'> & {
    'visitHours': number
};

export class VisitsByDepartmentsStatController extends AbstractStatisticWidgetController<VisitByDepartmentsTableData> {

    constructor(translate: TranslateService, private readonly statProvider: StatisticsService) {
        super(translate, 'StatisticsPage.VisitsByDepartments');
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
                        label: this.translate.instant('StatisticsPage.VisitsByDepartments.VisitCount'),
                        data: data.map(x => x.visitCount),
                        backgroundColor: ChartColor.yellow,
                        stack: 'stack 0'
                    },
                    {
                        label: this.translate.instant('StatisticsPage.VisitsByDepartments.VisitHours'),
                        data: data.map(x => x.visitHours),
                        backgroundColor: ChartColor.blue,
                        stack: 'stack 1'
                    }
                ]
            }
        } as ChartConfiguration;
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

    protected async loadData(from: string, to: string, city: OperationCity): Promise<Array<VisitByDepartmentsTableData>> {
        const data = await firstValueFrom(this.statProvider.getVisitsByDepartmentsStat(from, to, city));
        return data.map(this.prepareData.bind(this));
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
