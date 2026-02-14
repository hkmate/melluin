import {TranslateService} from '@ngx-translate/core';
import {WidgetTableData} from '@fe/app/statistics/model/widget-data';
import {ChartConfiguration} from 'chart.js';
import {OperationCity} from '@shared/person/operation-city';
import {firstValueFrom} from 'rxjs';
import {ChartColor} from '@fe/app/util/chart/chart-color';
import {WidgetMode} from '@fe/app/statistics/model/widget-mode';
import {AbstractStatisticWidgetController} from '@fe/app/statistics/controller/abstract-stat-widget-controller';
import {StatisticsService} from '@fe/app/statistics/service/statistics.service';
import {VolunteersVisitCount} from '@shared/statistics/volunteers-visit-count';


export type VolunteersVisitsCleanData = Omit<VolunteersVisitCount, 'personId'>;
export type VolunteersVisitsTableData = Omit<VolunteersVisitsCleanData, 'visitMinutes'> & { 'visitHours': number };

export class VolunteersVisitsStatController extends AbstractStatisticWidgetController<VolunteersVisitsTableData> {

    constructor(translate: TranslateService, private readonly statProvider: StatisticsService) {
        super(translate, 'StatisticsPage.VolunteersVisits');
    }

    public override defaultMode(): WidgetMode {
        return WidgetMode.TABLE;
    }

    // eslint-disable-next-line max-lines-per-function
    public getChartData(): ChartConfiguration {
        const data = this.data();
        return {
            type: 'bar',
            data: {
                labels: data.map(x => x.personName),
                datasets: [
                    {
                        label: this.translate.instant('StatisticsPage.VolunteersVisits.VisitCount'),
                        data: data.map(x => x.visitCount),
                        backgroundColor: ChartColor.yellow,
                        stack: 'stack 0'
                    },
                    {
                        label: this.translate.instant('StatisticsPage.VolunteersVisits.VisitHours'),
                        data: data.map(x => x.visitHours),
                        backgroundColor: ChartColor.blue,
                        stack: 'stack 1'
                    }
                ]
            }
        } as ChartConfiguration;
    }

    public getTableData(): WidgetTableData<VolunteersVisitsTableData> {
        return {
            headers: {
                personName: this.translate.instant('StatisticsPage.VolunteersVisits.PersonName'),
                visitCount: this.translate.instant('StatisticsPage.VolunteersVisits.VisitCount'),
                visitHours: this.translate.instant('StatisticsPage.VolunteersVisits.VisitHours'),
            },
            data: this.data()
        }
    }

    protected async loadData(from: string, to: string, city: OperationCity): Promise<Array<VolunteersVisitsTableData>> {
        const data = await firstValueFrom(this.statProvider.getVolunteersVisitCountStat(from, to, city));
        return this.prepareData(data);
    }



    private prepareData(original: Array<VolunteersVisitCount>): Array<VolunteersVisitsTableData> {
        return original.map(x => this.mapItem(x));
    }

    private mapItem(original: VolunteersVisitsCleanData): VolunteersVisitsTableData {
        return {
            personName: original.personName,
            visitCount: original.visitCount,
            // eslint-disable-next-line @typescript-eslint/no-magic-numbers
            visitHours: original.visitMinutes / 60
        };
    }

}
