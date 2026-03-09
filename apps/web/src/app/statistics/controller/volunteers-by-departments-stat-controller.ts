import {WidgetTableData} from '@fe/app/statistics/model/widget-data';
import {ChartConfiguration} from 'chart.js';
import {isNil, OperationCity, VolunteerByDepartments} from '@melluin/common';
import {firstValueFrom} from 'rxjs';
import {ChartColor} from '@fe/app/util/chart/chart-color';
import {AbstractStatisticWidgetController} from '@fe/app/statistics/controller/abstract-stat-widget-controller';
import {VolunteersByDepartmentsStatProvider} from '@fe/app/statistics/service/volunteers-by-departments-stat-provider';
import {uniq} from 'lodash-es';
import {t} from '@fe/app/util/translate/translate';

export type VolunteerByDepartmentsTableData =
    Omit<VolunteerByDepartments, 'personId' | 'departmentId' | 'visitMinutes'>
    & {
    'visitHours': number
};

export class VolunteersByDepartmentsStatController extends AbstractStatisticWidgetController<VolunteerByDepartmentsTableData> {

    constructor(private readonly statProvider: VolunteersByDepartmentsStatProvider) {
        super('StatisticsPage.VolunteersByDepartments');
    }

    // eslint-disable-next-line max-lines-per-function
    public getChartData(): ChartConfiguration {
        const colors = Object.values(ChartColor);
        const people = uniq(this.data().map(x => x.personName));
        const departmentNames = uniq(this.data().map(x => x.departmentName));
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

    public getTableData(): WidgetTableData<VolunteerByDepartmentsTableData> {
        return {
            headers: {
                personName: t('StatisticsPage.VolunteersByDepartments.PersonName'),
                departmentName: t('StatisticsPage.VolunteersByDepartments.DepartmentName'),
                visitCount: t('StatisticsPage.VolunteersByDepartments.VisitCount'),
                visitHours: t('StatisticsPage.VolunteersByDepartments.VisitHours'),
            },
            data: this.data()
        }
    }

    protected async loadData(from: string, to: string, city: OperationCity): Promise<Array<VolunteerByDepartmentsTableData>> {
        const data = await firstValueFrom(this.statProvider.getVolunteersByDepartmentsStat(from, to, city));
        return this.prepareData(data);
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
