import {TranslateService} from '@ngx-translate/core';
import {WidgetTableData} from '@fe/app/statistics/model/widget-data';
import {ChartConfiguration} from 'chart.js';
import {isNilOrEmpty} from '@shared/util/util';
import {OperationCity} from '@shared/person/operation-city';
import {firstValueFrom} from 'rxjs';
import {ChildrenByDepartments} from '@shared/statistics/children-by-departments';
import {ChartColor} from '@fe/app/util/chart/chart-color';
import {WidgetMode} from '@fe/app/statistics/model/widget-mode';
import {AbstractStatisticWidgetController} from '@fe/app/statistics/controller/abstract-stat-widget-controller';
import {ChildrenByDepartmentsStatProvider} from '@fe/app/statistics/service/children-by-departments-stat-provider';

export type ChildrenTableData = Omit<ChildrenByDepartments, 'departmentId' | 'departmentName'>;

export class ChildrenStatController extends AbstractStatisticWidgetController<ChildrenTableData> {

    constructor(translate: TranslateService, private readonly statProvider: ChildrenByDepartmentsStatProvider) {
        super(translate, 'StatisticsPage.Children');
    }

    public override defaultMode(): WidgetMode {
        return WidgetMode.TABLE;
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
        const [stat] = this.data();
        return [
            stat.childContact,
            stat.child,
            stat.childWithRelativePresent
        ];
    }

}
