import {StatisticWidgetController} from '@fe/app/statistics/controller/widget-controller';
import {TranslateService} from '@ngx-translate/core';
import {StatisticsService} from '@fe/app/statistics/statistics.service';
import {WidgetExportingInfo, WidgetTableData} from '@fe/app/statistics/model/widget-data';
import {ChartConfiguration} from 'chart.js';
import {VolunteerByDepartments} from '@shared/statistics/volunteer-by-departments';
import {Signal, signal} from '@angular/core';
import {OperationCity} from '@shared/person/operation-city';
import {firstValueFrom} from 'rxjs';
import * as _ from 'lodash';
import {isNil} from '@shared/util/util';
import {ChartColor} from '@fe/app/util/chart/chart-color';

export type VolunteerByDepartmentsTableData =
    Omit<VolunteerByDepartments, 'personId' | 'departmentId' | 'visitMinutes'>
    & {
    'visitHours': number
};

export class VolunteersByDepartmentsStatController implements StatisticWidgetController<VolunteerByDepartmentsTableData> {

    protected readonly data = signal<Array<VolunteerByDepartmentsTableData>>([]);
    private readonly ready = signal(false);

    constructor(private readonly translate: TranslateService, private readonly statisticsService: StatisticsService) {
    }

    public hasData(): Signal<boolean> {
        return this.ready;
    }

    public async load(from: string, to: string, city: OperationCity): Promise<void> {
        const data = await firstValueFrom(this.statisticsService.getVolunteersByDepartmentsStat(from, to, city));
        this.data.set(this.prepareData(data));
        this.ready.set(true);
    }

    public getExportingInfo(): WidgetExportingInfo<VolunteerByDepartmentsTableData> {
        return {
            ...this.getTableData(),
            fileName: this.translate.instant('StatisticsPage.VolunteersByDepartments.ExportedFileName')
        }
    }

    public getName(): string {
        return this.translate.instant('StatisticsPage.VolunteersByDepartments.Title');
    }


    public getTableData(): WidgetTableData<VolunteerByDepartmentsTableData> {
        return {
            headers: {
                personName: this.translate.instant('StatisticsPage.VolunteersByDepartments.PersonName'),
                departmentName: this.translate.instant('StatisticsPage.VolunteersByDepartments.DepartmentName'),
                visitCount: this.translate.instant('StatisticsPage.VolunteersByDepartments.VisitCount'),
                visitHours: this.translate.instant('StatisticsPage.VolunteersByDepartments.VisitHours'),
            },
            data: this.data()
        }
    }

    private prepareData(original: Array<VolunteerByDepartments>): Array<VolunteerByDepartmentsTableData> {
        return original.map(x => this.mapItem(x));
    }

    private mapItem(original: VolunteerByDepartments): VolunteerByDepartmentsTableData {
        return {
            personName: original.personName,
            departmentName: original.departmentName,
            visitCount: original.visitCount,
            // eslint-disable-next-line @typescript-eslint/no-magic-numbers
            visitHours: original.visitMinutes / 60
        };
    }

// eslint-disable-next-line max-lines-per-function
    public getChartData(): ChartConfiguration {
        const colors = Object.values(ChartColor);
        const people = _.uniq(this.data().map(x => x.personName));
        const departmentNames = _.uniq(this.data().map(x => x.departmentName));
        const dataByPeople = this.getDataByPeople();

        return {
            type: 'bar',
            data: {
                labels: people,
                datasets: departmentNames.map(((departmentName, index) => ({
                    label: departmentName,
                    data: people.map(person => dataByPeople[person][departmentName]),
                    backgroundColor: colors[index],
                    stack: 'stack 0'
                })))
            }
        } as ChartConfiguration;
    }

    private getDataByPeople(): Record<string, Record<string, number>> {
        return this.data().reduce((acc, curr) => {
            if (isNil(acc[curr.personName])) {
                acc[curr.personName] = {};
            }
            acc[curr.personName][curr.departmentName] = curr.visitCount;
            return acc;
        }, {});
    }

}
