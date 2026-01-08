import {StatisticWidgetController} from '@fe/app/statistics/controller/widget-controller';
import {TranslateService} from '@ngx-translate/core';
import {StatisticsService} from '@fe/app/statistics/service/statistics.service';
import {WidgetExportingInfo, WidgetTableData} from '@fe/app/statistics/model/widget-data';
import {ChartConfiguration} from 'chart.js';
import {OperationCity} from '@shared/person/operation-city';
import {computed, signal, Signal} from '@angular/core';
import {isNotNil} from '@shared/util/util';
import {ActivitiesCount} from '@shared/statistics/activities-count';
import {firstValueFrom} from 'rxjs';
import {ChartColor} from '@fe/app/util/chart/chart-color';
import {WidgetMode} from '@fe/app/statistics/model/widget-mode';


export interface ActivitiesCountTableData {
    activity: string;
    count: number;
}

export class ActivitiesStatController implements StatisticWidgetController<ActivitiesCountTableData> {

    protected readonly data = signal<Array<ActivitiesCountTableData> | null>(null);
    private readonly ready = computed(() => isNotNil(this.data()));

    constructor(private readonly translate: TranslateService, private readonly statisticsService: StatisticsService) {
    }

    public hasData(): Signal<boolean> {
        return this.ready;
    }

    public defaultMode(): WidgetMode {
        return WidgetMode.CHART;
    }

    public async load(from: string, to: string, city: OperationCity): Promise<void> {
        const data = await firstValueFrom(this.statisticsService.getActivitiesStat(from, to, city));
        this.data.set(this.prepareData(data));
    }

    // eslint-disable-next-line max-lines-per-function
    public getChartData(): ChartConfiguration {
        const data = this.data() ?? [];
        return {
            type: 'bar',
            data: {
                labels: data.map(x => x.activity),
                datasets: [
                    {
                        label: this.translate.instant('StatisticsPage.Activities.Count'),
                        data: data.map(x => x.count),
                        backgroundColor: ChartColor.blue,
                        stack: 'stack 0'
                    },
                ]
            }
        } as ChartConfiguration;
    }

    public getExportingInfo(): WidgetExportingInfo<ActivitiesCountTableData> {
        return {
            ...this.getTableData(),
            fileName: this.translate.instant('StatisticsPage.Activities.ExportedFileName')
        }
    }

    public getName(): string {
        return this.translate.instant('StatisticsPage.Activities.Title');
    }

    public getTableData(): WidgetTableData<ActivitiesCountTableData> {
        return {
            headers: {
                activity: this.translate.instant('StatisticsPage.Activities.Activity'),
                count: this.translate.instant('StatisticsPage.Activities.Count'),
            },
            data: this.data() ?? []
        }
    }

    private prepareData(rawData: Array<ActivitiesCount>): Array<ActivitiesCountTableData> {
        const translatedData = rawData.map(x => ({
            ...x,
            activity: this.translate.instant(`VisitActivityType.${x.activity}`) as string
        } satisfies ActivitiesCountTableData));
        translatedData.sort((a, b) => a.activity.localeCompare(b.activity));
        return translatedData;
    }

}
