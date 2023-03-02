import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '@fe/environment';
import {Observable} from 'rxjs';
import {WrappedHospitalVisitActivity} from '@shared/hospital-visit-activity/wrapped-hospital-visit-activity';
import {HospitalVisitActivity} from '@shared/hospital-visit-activity/hospital-visit-activity';

@Injectable({providedIn: 'root'})
export class VisitActivityService {

    constructor(private readonly http: HttpClient) {
    }

    private getActivitiesUrl(visitId: string): string {
        return `${environment.baseURL}/hospital-visits/${visitId}/activities`;
    }

    private getRelatedActivitiesUrl(visitId: string): string {
        return `${environment.baseURL}/hospital-visits/${visitId}/related/activities`;
    }

    public add(visitId: string, activity: HospitalVisitActivity): Observable<HospitalVisitActivity> {
        return this.http.post<HospitalVisitActivity>(`${this.getActivitiesUrl(visitId)}`, activity);
    }

    public getActivities(visitId: string): Observable<WrappedHospitalVisitActivity> {
        return this.http.get<WrappedHospitalVisitActivity>(`${this.getActivitiesUrl(visitId)}`);
    }

    public getRelatedActivities(visitId: string): Observable<Array<WrappedHospitalVisitActivity>> {
        return this.http.get<Array<WrappedHospitalVisitActivity>>(`${this.getRelatedActivitiesUrl(visitId)}`);
    }

}
