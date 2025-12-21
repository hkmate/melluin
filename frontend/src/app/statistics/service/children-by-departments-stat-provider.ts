import {OperationCity} from '@shared/person/operation-city';
import {Observable, shareReplay} from 'rxjs';
import {ChildrenByDepartments} from '@shared/statistics/children-by-departments';
import {inject, Injectable} from '@angular/core';
import {StatisticsService} from '@fe/app/statistics/service/statistics.service';
import * as _ from 'lodash';

export interface ChildrenByDepartmentsStatProvider {
    getChildrenByDepartmentsStat(from: string, to: string, city: OperationCity): Observable<Array<ChildrenByDepartments>>;
}

@Injectable()
export class ChildrenByDepartmentsStatProviderService implements ChildrenByDepartmentsStatProvider {

    private readonly statisticsService = inject(StatisticsService);

    private activeFilter: Array<string> | null = null;
    private request: Observable<Array<ChildrenByDepartments>> | null = null;

    public getChildrenByDepartmentsStat(from: string, to: string, city: OperationCity): Observable<Array<ChildrenByDepartments>> {
        const newFilter = [from, to, city];
        if (_.isEqual(this.activeFilter, newFilter)) {
            return this.request!
        }

        this.activeFilter = newFilter;
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        this.request = this.statisticsService.getChildrenByDepartmentsStat(from, to, city).pipe(shareReplay(10));
        return this.request;
    }

}
