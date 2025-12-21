import {StatisticWidgetController} from '@fe/app/statistics/controller/widget-controller';
import {TranslateService} from '@ngx-translate/core';
import {StatisticsService} from '@fe/app/statistics/statistics.service';
import {WidgetExportingInfo, WidgetTableData} from '@fe/app/statistics/model/widget-data';
import {ChartConfiguration} from 'chart.js';
import {VolunteerByDepartments} from '@shared/statistics/volunteer-by-departments';
import {computed, Signal, signal} from '@angular/core';
import {isNotNil} from '@shared/util/util';
import {OperationCity} from '@shared/person/operation-city';
import {firstValueFrom} from 'rxjs';
import {isNil} from 'lodash';
import {ChartColor} from '@fe/app/util/chart/chart-color';


export type VolunteersVisitsCleanData = Omit<VolunteerByDepartments, 'personId' | 'departmentId' | 'departmentName'>;
export type VolunteersVisitsTableData = Omit<VolunteersVisitsCleanData, 'visitMinutes'> & { 'visitHours': number };

export class VolunteersVisitsStatController implements StatisticWidgetController<VolunteersVisitsTableData> {

    protected readonly data = signal<Array<VolunteersVisitsTableData> | null>(null);
    private readonly ready = computed(() => isNotNil(this.data()));

    constructor(private readonly translate: TranslateService, private readonly statisticsService: StatisticsService) {
    }

    public hasData(): Signal<boolean> {
        return this.ready;
    }

    public async load(from: string, to: string, city: OperationCity): Promise<void> {
        const data = await firstValueFrom(this.statisticsService.getVolunteersByDepartmentsStat(from, to, city));
        this.data.set(this.prepareData(data));
    }

    // eslint-disable-next-line max-lines-per-function
    public getChartData(): ChartConfiguration {
        const data = this.data() ?? [];
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

    public getExportingInfo(): WidgetExportingInfo<VolunteersVisitsTableData> {
        return {
            ...this.getTableData(),
            fileName: this.translate.instant('StatisticsPage.VolunteersVisits.ExportedFileName')
        }
    }

    public getName(): string {
        return this.translate.instant('StatisticsPage.VolunteersVisits.Title');
    }


    public getTableData(): WidgetTableData<VolunteersVisitsTableData> {
        return {
            headers: {
                personName: this.translate.instant('StatisticsPage.VolunteersVisits.PersonName'),
                visitCount: this.translate.instant('StatisticsPage.VolunteersVisits.VisitCount'),
                visitHours: this.translate.instant('StatisticsPage.VolunteersVisits.VisitHours'),
            },
            data: this.data() ?? []
        }
    }

    // eslint-disable-next-line max-lines-per-function
    private prepareData(original: Array<VolunteerByDepartments>): Array<VolunteersVisitsTableData> {
        const visitDataByPerson: Record<string, VolunteersVisitsCleanData> = {};
        for (const raw of original) {
            const personId = raw.personId;
            if (isNil(visitDataByPerson[personId])) {
                visitDataByPerson[personId] = {
                    personName: raw.personName,
                    visitCount: 0,
                    visitMinutes: 0
                };
            }
            visitDataByPerson[personId].visitCount += raw.visitCount;
            visitDataByPerson[personId].visitMinutes += raw.visitMinutes;
        }
        const cleanData = Object.values(visitDataByPerson);
        return cleanData.map(x => this.mapItem(x));
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
