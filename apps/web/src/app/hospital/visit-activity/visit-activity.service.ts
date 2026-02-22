import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {
    VisitActivity,
    VisitActivityEditInput,
    VisitActivityInput,
    WrappedVisitActivity
} from '@melluin/common';
import {getErrorHandler} from '@fe/app/util/util';
import {MessageService} from '@fe/app/util/message.service';
import {environment} from '@fe/environment';

@Injectable({providedIn: 'root'})
export class VisitActivityService {

    private readonly http = inject(HttpClient);
    private readonly msg = inject(MessageService);

    private getActivitiesUrl(visitId: string): string {
        return `${environment.baseURL}/visits/${visitId}/activities`;
    }

    private getRelatedActivitiesUrl(visitId: string): string {
        return `${environment.baseURL}/visits/${visitId}/related/activities`;
    }

    public add(visitId: string, activity: VisitActivityInput): Observable<VisitActivity> {
        return this.http.post<VisitActivity>(`${this.getActivitiesUrl(visitId)}`, activity)
            .pipe(getErrorHandler<VisitActivity>(this.msg));
    }

    public update(visitId: string, activityId: string, activity: VisitActivityEditInput): Observable<VisitActivity> {
        return this.http.put<VisitActivity>(`${this.getActivitiesUrl(visitId)}/${activityId}`, activity)
            .pipe(getErrorHandler<VisitActivity>(this.msg));
    }

    public delete(visitId: string, activityId: string): Observable<void> {
        return this.http.delete<void>(`${this.getActivitiesUrl(visitId)}/${activityId}`)
            .pipe(getErrorHandler<void>(this.msg));
    }

    public getActivities(visitId: string): Observable<WrappedVisitActivity> {
        return this.http.get<WrappedVisitActivity>(`${this.getActivitiesUrl(visitId)}`)
            .pipe(getErrorHandler<WrappedVisitActivity>(this.msg));
    }

    public getRelatedActivities(visitId: string): Observable<Array<WrappedVisitActivity>> {
        return this.http.get<Array<WrappedVisitActivity>>(`${this.getRelatedActivitiesUrl(visitId)}`)
            .pipe(getErrorHandler<Array<WrappedVisitActivity>>(this.msg));
    }

}
