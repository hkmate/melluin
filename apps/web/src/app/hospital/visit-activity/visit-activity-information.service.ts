import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MessageService} from '@fe/app/util/message.service';
import {Observable} from 'rxjs';
import {getErrorHandler} from '@fe/app/util/error/error-handler';
import {UUID, VisitActivityInfo, VisitActivityInfoInput} from '@melluin/common';
import {environment} from '@fe/environment';

@Injectable({providedIn: 'root'})
export class VisitActivityInformationService {

    private readonly http = inject(HttpClient);
    private readonly msg = inject(MessageService);

    private getActivitiesInformationUrl(visitId: UUID): string {
        return `${environment.baseURL}/visits/${visitId}/activities-information`;
    }

    public set(visitId: UUID, activityInfo: VisitActivityInfoInput): Observable<VisitActivityInfo> {
        return this.http.put<VisitActivityInfo>(`${this.getActivitiesInformationUrl(visitId)}`, activityInfo)
            .pipe(getErrorHandler<VisitActivityInfo>(this.msg));
    }

    public getActivitiesInformation(visitId: UUID): Observable<VisitActivityInfo> {
        return this.http.get<VisitActivityInfo>(`${this.getActivitiesInformationUrl(visitId)}`)
            .pipe(getErrorHandler<VisitActivityInfo>(this.msg));
    }

}
