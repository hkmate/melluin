import {OperationCity} from '@shared/person/operation-city';
import {Observable, shareReplay} from 'rxjs';
import {ChildAgesByDepartments} from '@shared/statistics/child-ages-by-departments';
import {inject, Injectable} from '@angular/core';
import {StatisticsService} from '@fe/app/statistics/service/statistics.service';
import * as _ from 'lodash';

export interface ChildAgesByDepartmentsStatProvider {
    getChildAgesByDepartmentsStat(from: string, to: string, city: OperationCity): Observable<Array<ChildAgesByDepartments>>;
}


@Injectable()
export class ChildAgesByDepartmentsStatProviderService implements ChildAgesByDepartmentsStatProvider {

    private readonly statisticsService = inject(StatisticsService);

    private activeFilter: Array<string> | null = null;
    private request: Observable<Array<ChildAgesByDepartments>> | null = null;

    public getChildAgesByDepartmentsStat(from: string, to: string, city: OperationCity): Observable<Array<ChildAgesByDepartments>> {
        const newFilter = [from, to, city];
        if (_.isEqual(this.activeFilter, newFilter)) {
            return this.request!
        }

        this.activeFilter = newFilter;
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        this.request = this.statisticsService.getChildAgesByDepartmentsStat(from, to, city).pipe(shareReplay(10));
        return this.request;
    }

}
