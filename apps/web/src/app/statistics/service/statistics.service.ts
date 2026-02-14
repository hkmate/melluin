import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {getErrorHandler} from '@fe/app/util/util';
import {MessageService} from '@fe/app/util/message.service';
import {AppConfig} from '@fe/app/config/app-config';
import {OperationCity} from '@shared/person/operation-city';
import {VisitByDepartments} from '@shared/statistics/visit-by-departments';
import {ChildrenByDepartments} from '@shared/statistics/children-by-departments';
import {VisitStatusCount} from '@shared/statistics/visit-status-count';
import {VolunteerByDepartments} from '@shared/statistics/volunteer-by-departments';
import {ActivitiesCount} from '@shared/statistics/activities-count';
import {ChildAgesByDepartments} from '@shared/statistics/child-ages-by-departments';
import {VisitsCountByWeekDay} from '@shared/statistics/visits-count-by-week-day';
import {VisitCountByWeekDayStatProvider} from '@fe/app/statistics/service/visit-count-by-week-day-stat-provider';
import {ChildrenByDepartmentsStatProvider} from '@fe/app/statistics/service/children-by-departments-stat-provider';
import {ChildAgesByDepartmentsStatProvider} from '@fe/app/statistics/service/child-ages-by-departments-stat-provider';
import {VolunteersByDepartmentsStatProvider} from '@fe/app/statistics/service/volunteers-by-departments-stat-provider';
import {VolunteersVisitCount} from '@shared/statistics/volunteers-visit-count';

const FROM_KEY = 'from';
const TO_KEY = 'to';
const CITY_KEY = 'city';

type StatType =
    'visits-count-by-week-day'
    | 'visits-by-departments'
    | 'children-by-departments'
    | 'visits-by-statuses'
    | 'volunteer-by-departments'
    | 'volunteers-visit-count'
    | 'activities'
    | 'child-ages-by-departments'

@Injectable()
export class StatisticsService implements VisitCountByWeekDayStatProvider, ChildrenByDepartmentsStatProvider,
    ChildAgesByDepartmentsStatProvider, VolunteersByDepartmentsStatProvider {

    private readonly http = inject(HttpClient);
    private readonly msg = inject(MessageService);

    public getVisitsCountByWeekDayStat(from: string, to: string, city: OperationCity): Observable<Array<VisitsCountByWeekDay>> {
        return this.getStat<VisitsCountByWeekDay>('visits-count-by-week-day', from, to, city);
    }

    public getVisitsByDepartmentsStat(from: string, to: string, city: OperationCity): Observable<Array<VisitByDepartments>> {
        return this.getStat<VisitByDepartments>('visits-by-departments', from, to, city);
    }

    public getChildrenByDepartmentsStat(from: string, to: string, city: OperationCity): Observable<Array<ChildrenByDepartments>> {
        return this.getStat<ChildrenByDepartments>('children-by-departments', from, to, city);
    }

    public getVisitsByStatusesStat(from: string, to: string, city: OperationCity): Observable<Array<VisitStatusCount>> {
        return this.getStat<VisitStatusCount>('visits-by-statuses', from, to, city);
    }

    public getVolunteersByDepartmentsStat(from: string, to: string, city: OperationCity): Observable<Array<VolunteerByDepartments>> {
        return this.getStat<VolunteerByDepartments>('volunteer-by-departments', from, to, city);
    }

    public getVolunteersVisitCountStat(from: string, to: string, city: OperationCity): Observable<Array<VolunteersVisitCount>> {
        return this.getStat<VolunteersVisitCount>('volunteers-visit-count', from, to, city);
    }

    public getActivitiesStat(from: string, to: string, city: OperationCity): Observable<Array<ActivitiesCount>> {
        return this.getStat<ActivitiesCount>('activities', from, to, city);
    }

    public getChildAgesByDepartmentsStat(from: string, to: string, city: OperationCity): Observable<Array<ChildAgesByDepartments>> {
        return this.getStat<ChildAgesByDepartments>('child-ages-by-departments', from, to, city);
    }

    // eslint-disable-next-line max-params-no-constructor/max-params-no-constructor
    private getStat<T>(type: StatType, from: string, to: string, city: OperationCity): Observable<Array<T>> {
        return this.http.get<Array<T>>(this.statUrl(type), {
            params: {
                [FROM_KEY]: from,
                [TO_KEY]: to,
                [CITY_KEY]: city
            }
        })
            .pipe(getErrorHandler<Array<T>>(this.msg));
    }

    private statUrl(subPath: string): string {
        return `${AppConfig.get('baseURL')}/statistics/${subPath}`;
    }

}


