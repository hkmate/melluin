import {TranslateService} from '@ngx-translate/core';
import {StatisticsService} from '@fe/app/statistics/service/statistics.service';
import {WidgetTableData} from '@fe/app/statistics/model/widget-data';
import {ChartConfiguration} from 'chart.js';
import {OperationCity} from '@shared/person/operation-city';
import {firstValueFrom} from 'rxjs';
import {VisitStatusCount} from '@shared/statistics/visit-status-count';
import {visitStatusOrders} from '@shared/hospital-visit/hospital-visit-status';
import {ChartColor} from '@fe/app/util/chart/chart-color';
import {AbstractStatisticWidgetController} from '@fe/app/statistics/controller/abstract-stat-widget-controller';


export type VisitStatusCountTableData = Omit<VisitStatusCount, 'status'> & { status: string };

export class VisitsByStatusesStatController extends AbstractStatisticWidgetController<VisitStatusCountTableData> {

    constructor(translate: TranslateService, private readonly statProvider: StatisticsService) {
        super(translate, 'StatisticsPage.VisitsByStatuses');
    }

    // eslint-disable-next-line max-lines-per-function
    public getChartData(): ChartConfiguration {
        const data = this.data();
        return {
            type: 'bar',
            data: {
                labels: data.map(x => x.status),
                datasets: [
                    {
                        label: this.translate.instant('StatisticsPage.VisitsByStatuses.Count'),
                        data: data.map(x => x.count),
                        backgroundColor: ChartColor.blue,
                        stack: 'stack 0'
                    },
                ]
            },
            options: {
                scales: {
                    y: {
                        display: true,
                        type: 'logarithmic',
                    }
                }
            }
        } as ChartConfiguration;
    }

    public getTableData(): WidgetTableData<VisitStatusCountTableData> {
        return {
            headers: {
                status: this.translate.instant('StatisticsPage.VisitsByStatuses.Status'),
                count: this.translate.instant('StatisticsPage.VisitsByStatuses.Count'),
            },
            data: this.data()
        }
    }

    protected async loadData(from: string, to: string, city: OperationCity): Promise<Array<VisitStatusCountTableData>> {
        const data = await firstValueFrom(this.statProvider.getVisitsByStatusesStat(from, to, city));
        return this.prepareData(data);
    }

    private prepareData(original: Array<VisitStatusCount>): Array<VisitStatusCountTableData> {
        const order = visitStatusOrders();
        const sortedData = [...original].sort((a, b) => order[a.status] - order[b.status]);

        return sortedData.map(x => this.mapItem(x));
    }

    private mapItem(original: VisitStatusCount): VisitStatusCountTableData {
        return {
            status: this.translate.instant(`HospitalVisitStatus.${original.status}`),
            count: original.count,
        };
    }

}
