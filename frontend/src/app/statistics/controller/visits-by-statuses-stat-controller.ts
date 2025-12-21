import {StatisticWidgetController} from '@fe/app/statistics/controller/widget-controller';
import {TranslateService} from '@ngx-translate/core';
import {StatisticsService} from '@fe/app/statistics/statistics.service';
import {WidgetExportingInfo, WidgetTableData} from '@fe/app/statistics/model/widget-data';
import {ChartConfiguration} from 'chart.js';
import {computed, Signal, signal} from '@angular/core';
import {isNotNil} from '@shared/util/util';
import {OperationCity} from '@shared/person/operation-city';
import {firstValueFrom} from 'rxjs';
import {VisitStatusCount} from '@shared/statistics/visit-status-count';
import {visitStatusOrders} from '@shared/hospital-visit/hospital-visit-status';


export type VisitStatusCountTableData = Omit<VisitStatusCount, 'status'> & { status: string };

export class VisitsByStatusesStatController implements StatisticWidgetController<VisitStatusCountTableData> {

    protected readonly data = signal<Array<VisitStatusCountTableData> | null>(null);
    private readonly ready = computed(() => isNotNil(this.data()));

    constructor(private readonly translate: TranslateService, private readonly statisticsService: StatisticsService) {
    }

    public hasData(): Signal<boolean> {
        return this.ready;
    }

    public async load(from: string, to: string, city: OperationCity): Promise<void> {
        const data = await firstValueFrom(this.statisticsService.getVisitsByStatusesStat(from, to, city));
        this.data.set(this.prepareData(data));
    }

    public getChartData(): ChartConfiguration {
        return {
            type: 'bar',
            data: {
                // datasets: this.data() ?? []
            }
        } as ChartConfiguration;
    }

    public getExportingInfo(): WidgetExportingInfo<VisitStatusCountTableData> {
        return {
            ...this.getTableData(),
            fileName: this.translate.instant('StatisticsPage.VisitsByStatuses.ExportedFileName')
        }
    }

    public getName(): string {
        return this.translate.instant('StatisticsPage.VisitsByStatuses.Title');
    }


    public getTableData(): WidgetTableData<VisitStatusCountTableData> {
        return {
            headers: {
                status: this.translate.instant('StatisticsPage.VisitsByStatuses.Status'),
                count: this.translate.instant('StatisticsPage.VisitsByStatuses.Count'),
            },
            data: this.data() ?? []
        }
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
