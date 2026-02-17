import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MessageService} from '@fe/app/util/message.service';
import {AppConfig} from '@fe/app/config/app-config';
import {Observable} from 'rxjs';
import {getErrorHandler} from '@fe/app/util/util';
import {VisitActivityInfo, VisitActivityInfoInput} from '@melluin/common';

@Injectable({providedIn: 'root'})
export class VisitActivityInformationService {

    private readonly http = inject(HttpClient);
    private readonly msg = inject(MessageService);

    private getActivitiesInformationUrl(visitId: string): string {
        return `${AppConfig.get('baseURL')}/visits/${visitId}/activities-information`;
    }

    public set(visitId: string, activityInfo: VisitActivityInfoInput): Observable<VisitActivityInfo> {
        return this.http.put<VisitActivityInfo>(`${this.getActivitiesInformationUrl(visitId)}`, activityInfo)
            .pipe(getErrorHandler<VisitActivityInfo>(this.msg));
    }

    public getActivitiesInformation(visitId: string): Observable<VisitActivityInfo> {
        return this.http.get<VisitActivityInfo>(`${this.getActivitiesInformationUrl(visitId)}`)
            .pipe(getErrorHandler<VisitActivityInfo>(this.msg));
    }

}
