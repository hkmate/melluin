import {WidgetTableData} from '@fe/app/statistics/model/widget-data';
import {ChartConfiguration} from 'chart.js';
import {ChildrenByDepartments, isNilOrEmpty, OperationCity} from '@melluin/common';
import {firstValueFrom} from 'rxjs';
import {ChartColor} from '@fe/app/util/chart/chart-color';
import {WidgetMode, WidgetModes} from '@fe/app/statistics/model/widget-mode';
import {AbstractStatisticWidgetController} from '@fe/app/statistics/controller/abstract-stat-widget-controller';
import {ChildrenByDepartmentsStatProvider} from '@fe/app/statistics/service/children-by-departments-stat-provider';
import {t} from '@fe/app/util/translate/translate';

export type ChildrenTableData = Omit<ChildrenByDepartments, 'departmentId' | 'departmentName'>;

export class ChildrenStatController extends AbstractStatisticWidgetController<ChildrenTableData> {

    constructor(private readonly statProvider: ChildrenByDepartmentsStatProvider) {
        super('StatisticsPage.Children');
    }

    public override defaultMode(): WidgetMode {
        return WidgetModes.TABLE;
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

    public getTableData(): WidgetTableData<ChildrenTableData> {
        return {
            headers: this.getHeaders(),
            data: this.data()
        }
    }

    protected async loadData(from: string, to: string, city: OperationCity): Promise<Array<ChildrenTableData>> {
        const data = await firstValueFrom(this.statProvider.getChildrenByDepartmentsStat(from, to, city));
        return this.prepareData(data);
    }

    private getHeaders(): Record<keyof ChildrenTableData, string> {
        return {
            childContact: t('StatisticsPage.Children.ChildContact'),
            child: t('StatisticsPage.Children.Child'),
            childWithRelativePresent: t('StatisticsPage.Children.ChildWithRelativePresent'),
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
        const [stat] = this.data();
        return [
            stat.childContact,
            stat.child,
            stat.childWithRelativePresent
        ];
    }

}
