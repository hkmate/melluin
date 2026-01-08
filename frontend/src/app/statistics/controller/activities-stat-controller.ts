import {TranslateService} from '@ngx-translate/core';
import {StatisticsService} from '@fe/app/statistics/service/statistics.service';
import {WidgetTableData} from '@fe/app/statistics/model/widget-data';
import {ChartConfiguration} from 'chart.js';
import {OperationCity} from '@shared/person/operation-city';
import {ActivitiesCount} from '@shared/statistics/activities-count';
import {firstValueFrom} from 'rxjs';
import {ChartColor} from '@fe/app/util/chart/chart-color';
import {AbstractStatisticWidgetController} from '@fe/app/statistics/controller/abstract-stat-widget-controller';


export interface ActivitiesCountTableData {
    activity: string;
    count: number;
}

export class ActivitiesStatController extends AbstractStatisticWidgetController<ActivitiesCountTableData> {

    constructor(translate: TranslateService, private readonly statProvider: StatisticsService) {
        super(translate, 'StatisticsPage.Activities');
    }

    // eslint-disable-next-line max-lines-per-function
    public getChartData(): ChartConfiguration {
        const data = this.data();
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

    public getTableData(): WidgetTableData<ActivitiesCountTableData> {
        return {
            headers: {
                activity: this.translate.instant('StatisticsPage.Activities.Activity'),
                count: this.translate.instant('StatisticsPage.Activities.Count'),
            },
            data: this.data()
        }
    }

    protected async loadData(from: string, to: string, city: OperationCity): Promise<Array<ActivitiesCountTableData>> {
        const data = await firstValueFrom(this.statProvider.getActivitiesStat(from, to, city));
        return this.prepareData(data);
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
