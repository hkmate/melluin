import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {HospitalVisit} from '@shared/hospital-visit/hospital-visit';
import {MessageService} from '@fe/app/util/message.service';
import {AppConfig} from '@fe/app/config/app-config';
import {getErrorHandler} from '@fe/app/util/util';

@Injectable({providedIn: 'root'})
export class HospitalVisitConnectionsService {

    private readonly http = inject(HttpClient);
    private readonly msg = inject(MessageService);

    private get hospitalVisitUrl(): string {
        return `${AppConfig.get('baseURL')}/hospital-visits`;
    }

    public addConnection(visitId: string, connectId: string): Observable<void> {
        return this.http.post<void>(`${this.hospitalVisitUrl}/${visitId}/connections/${connectId}`, {})
            .pipe(getErrorHandler<void>(this.msg));
    }

    public getConnections(visitId: string): Observable<Array<HospitalVisit>> {
        return this.http.get<Array<HospitalVisit>>(`${this.hospitalVisitUrl}/${visitId}/connections`)
            .pipe(getErrorHandler<Array<HospitalVisit>>(this.msg));
    }

    public deleteConnection(visitId: string, connectId: string): Observable<void> {
        return this.http.delete<void>(`${this.hospitalVisitUrl}/${visitId}/connections/${connectId}`)
            .pipe(getErrorHandler<void>(this.msg));
    }

}
