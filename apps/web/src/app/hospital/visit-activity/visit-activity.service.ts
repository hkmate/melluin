import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {
    UUID,
    VisitActivity,
    VisitActivityEditInput,
    VisitActivityInput,
    WrappedVisitActivity
} from '@melluin/common';
import {getErrorHandler} from '@fe/app/util/error/error-handler';
import {MessageService} from '@fe/app/util/message.service';
import {environment} from '@fe/environment';

@Injectable({providedIn: 'root'})
export class VisitActivityService {

    private readonly http = inject(HttpClient);
    private readonly msg = inject(MessageService);

    private getActivitiesUrl(visitId: UUID): string {
        return `${environment.baseURL}/visits/${visitId}/activities`;
    }

    private getRelatedActivitiesUrl(visitId: UUID): string {
        return `${environment.baseURL}/visits/${visitId}/related/activities`;
    }

    public add(visitId: UUID, activity: VisitActivityInput): Observable<VisitActivity> {
        return this.http.post<VisitActivity>(`${this.getActivitiesUrl(visitId)}`, activity)
            .pipe(getErrorHandler<VisitActivity>(this.msg));
    }

    public update(visitId: UUID, activityId: UUID, activity: VisitActivityEditInput): Observable<VisitActivity> {
        return this.http.put<VisitActivity>(`${this.getActivitiesUrl(visitId)}/${activityId}`, activity)
            .pipe(getErrorHandler<VisitActivity>(this.msg));
    }

    public delete(visitId: UUID, activityId: UUID): Observable<void> {
        return this.http.delete<void>(`${this.getActivitiesUrl(visitId)}/${activityId}`)
            .pipe(getErrorHandler<void>(this.msg));
    }

    public getActivities(visitId: UUID): Observable<WrappedVisitActivity> {
        return this.http.get<WrappedVisitActivity>(`${this.getActivitiesUrl(visitId)}`)
            .pipe(getErrorHandler<WrappedVisitActivity>(this.msg));
    }

    public getRelatedActivities(visitId: UUID): Observable<Array<WrappedVisitActivity>> {
        return this.http.get<Array<WrappedVisitActivity>>(`${this.getRelatedActivitiesUrl(visitId)}`)
            .pipe(getErrorHandler<Array<WrappedVisitActivity>>(this.msg));
    }

}
