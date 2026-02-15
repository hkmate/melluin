import {OperationCity, VolunteerByDepartments} from '@melluin/common';
import {Observable, shareReplay} from 'rxjs';
import {inject, Injectable} from '@angular/core';
import {StatisticsService} from '@fe/app/statistics/service/statistics.service';
import * as _ from 'lodash';

export interface VolunteersByDepartmentsStatProvider {
    getVolunteersByDepartmentsStat(from: string, to: string, city: OperationCity): Observable<Array<VolunteerByDepartments>>;
}

@Injectable()
export class VolunteersByDepartmentsStatProviderService implements VolunteersByDepartmentsStatProvider {

    private readonly statisticsService = inject(StatisticsService);

    private activeFilter: Array<string> | null = null;
    private request: Observable<Array<VolunteerByDepartments>> | null = null;

    public getVolunteersByDepartmentsStat(from: string, to: string, city: OperationCity): Observable<Array<VolunteerByDepartments>> {
        const newFilter = [from, to, city];
        if (_.isEqual(this.activeFilter, newFilter)) {
            return this.request!
        }

        this.activeFilter = newFilter;
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        this.request = this.statisticsService.getVolunteersByDepartmentsStat(from, to, city).pipe(shareReplay(10));
        return this.request;
    }

}
