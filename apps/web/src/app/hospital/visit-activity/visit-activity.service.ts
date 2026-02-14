import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {WrappedHospitalVisitActivity} from '@shared/hospital-visit-activity/wrapped-hospital-visit-activity';
import {HospitalVisitActivity} from '@shared/hospital-visit-activity/hospital-visit-activity';
import {getErrorHandler} from '@fe/app/util/util';
import {MessageService} from '@fe/app/util/message.service';
import {AppConfig} from '@fe/app/config/app-config';
import {
    HospitalVisitActivityEditInput,
    HospitalVisitActivityInput
} from '@shared/hospital-visit-activity/hospital-visit-activity-input';

@Injectable({providedIn: 'root'})
export class VisitActivityService {

    private readonly http = inject(HttpClient);
    private readonly msg = inject(MessageService);

    private getActivitiesUrl(visitId: string): string {
        return `${AppConfig.get('baseURL')}/hospital-visits/${visitId}/activities`;
    }

    private getRelatedActivitiesUrl(visitId: string): string {
        return `${AppConfig.get('baseURL')}/hospital-visits/${visitId}/related/activities`;
    }

    public add(visitId: string, activity: HospitalVisitActivityInput): Observable<HospitalVisitActivity> {
        return this.http.post<HospitalVisitActivity>(`${this.getActivitiesUrl(visitId)}`, activity)
            .pipe(getErrorHandler<HospitalVisitActivity>(this.msg));
    }

    public update(visitId: string, activityId: string, activity: HospitalVisitActivityEditInput): Observable<HospitalVisitActivity> {
        return this.http.put<HospitalVisitActivity>(`${this.getActivitiesUrl(visitId)}/${activityId}`, activity)
            .pipe(getErrorHandler<HospitalVisitActivity>(this.msg));
    }

    public delete(visitId: string, activityId: string): Observable<void> {
        return this.http.delete<void>(`${this.getActivitiesUrl(visitId)}/${activityId}`)
            .pipe(getErrorHandler<void>(this.msg));
    }

    public getActivities(visitId: string): Observable<WrappedHospitalVisitActivity> {
        return this.http.get<WrappedHospitalVisitActivity>(`${this.getActivitiesUrl(visitId)}`)
            .pipe(getErrorHandler<WrappedHospitalVisitActivity>(this.msg));
    }

    public getRelatedActivities(visitId: string): Observable<Array<WrappedHospitalVisitActivity>> {
        return this.http.get<Array<WrappedHospitalVisitActivity>>(`${this.getRelatedActivitiesUrl(visitId)}`)
            .pipe(getErrorHandler<Array<WrappedHospitalVisitActivity>>(this.msg));
    }

}
