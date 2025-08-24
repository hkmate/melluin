import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MessageService} from '@fe/app/util/message.service';
import {AppConfig} from '@fe/app/config/app-config';
import {Observable} from 'rxjs';
import {getErrorHandler} from '@fe/app/util/util';
import {HospitalVisitActivityInfo} from '@shared/hospital-visit-activity/hospital-visit-activity-info';
import {HospitalVisitActivityInfoInput} from '@shared/hospital-visit-activity/hospital-visit-activity-info-input';

@Injectable({providedIn: 'root'})
export class VisitActivityInformationService {

    constructor(private readonly http: HttpClient,
                private readonly msg: MessageService) {
    }

    private getActivitiesInformationUrl(visitId: string): string {
        return `${AppConfig.get('baseURL')}/hospital-visits/${visitId}/activities-information`;
    }

    public set(visitId: string, activityInfo: HospitalVisitActivityInfoInput): Observable<HospitalVisitActivityInfo> {
        return this.http.put<HospitalVisitActivityInfo>(`${this.getActivitiesInformationUrl(visitId)}`, activityInfo)
            .pipe(getErrorHandler<HospitalVisitActivityInfo>(this.msg));
    }

    public getActivitiesInformation(visitId: string): Observable<HospitalVisitActivityInfo> {
        return this.http.get<HospitalVisitActivityInfo>(`${this.getActivitiesInformationUrl(visitId)}`)
            .pipe(getErrorHandler<HospitalVisitActivityInfo>(this.msg));
    }

}
