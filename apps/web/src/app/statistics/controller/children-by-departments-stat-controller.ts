import {WidgetTableData} from '@fe/app/statistics/model/widget-data';
import {ChartConfiguration} from 'chart.js';
import {ChildrenByDepartments, OperationCity} from '@melluin/common';
import {firstValueFrom} from 'rxjs';
import {ChartColor} from '@fe/app/util/chart/chart-color';
import {AbstractStatisticWidgetController} from '@fe/app/statistics/controller/abstract-stat-widget-controller';
import {ChildrenByDepartmentsStatProvider} from '@fe/app/statistics/service/children-by-departments-stat-provider';
import {t} from '@fe/app/util/translate/translate';

export type ChildrenByDepartmentsTableData = Omit<ChildrenByDepartments, 'departmentId'>;

export class ChildrenByDepartmentsStatController extends AbstractStatisticWidgetController<ChildrenByDepartmentsTableData> {

    constructor(private readonly statProvider: ChildrenByDepartmentsStatProvider) {
        super('StatisticsPage.ChildrenByDepartments');
    }

    // eslint-disable-next-line max-lines-per-function
    public getChartData(): ChartConfiguration {
        const data = this.data();
        return {
            type: 'bar',
            data: {
                labels: data.map(x => x.departmentName),
                datasets: [
                    {
                        label: t('StatisticsPage.ChildrenByDepartments.ChildContact'),
                        data: data.map(x => x.childContact),
                        backgroundColor: ChartColor.yellow,
                        stack: 'stack 0'
                    },
                    {
                        label: t('StatisticsPage.ChildrenByDepartments.Child'),
                        data: data.map(x => x.child),
                        backgroundColor: ChartColor.blue,
                        stack: 'stack 1'
                    },
                    {
                        label: t('StatisticsPage.ChildrenByDepartments.ChildWithRelativePresent'),
                        data: data.map(x => x.childWithRelativePresent),
                        backgroundColor: ChartColor.purple,
                        stack: 'stack 2'
                    }
                ]
            }
        } as ChartConfiguration;
    }

    public getTableData(): WidgetTableData<ChildrenByDepartmentsTableData> {
        return {
            headers: {
                departmentName: t('StatisticsPage.ChildrenByDepartments.DepartmentName'),
                childContact: t('StatisticsPage.ChildrenByDepartments.ChildContact'),
                child: t('StatisticsPage.ChildrenByDepartments.Child'),
                childWithRelativePresent: t('StatisticsPage.ChildrenByDepartments.ChildWithRelativePresent'),
            },
            data: this.data()
        }
    }

    protected loadData(from: string, to: string, city: OperationCity): Promise<Array<ChildrenByDepartmentsTableData>> {
        return firstValueFrom(this.statProvider.getChildrenByDepartmentsStat(from, to, city));
    }

}
