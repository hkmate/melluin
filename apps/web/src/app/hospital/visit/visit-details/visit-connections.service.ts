import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {UUID, Visit} from '@melluin/common';
import {MessageService} from '@fe/app/util/message.service';
import {getErrorHandler} from '@fe/app/util/error/error-handler';
import {environment} from '@fe/environment';

@Injectable({providedIn: 'root'})
export class VisitConnectionsService {

    private readonly http = inject(HttpClient);
    private readonly msg = inject(MessageService);

    private get visitUrl(): string {
        return `${environment.baseURL}/visits`;
    }

    public addConnection(visitId: UUID, connectId: UUID): Observable<void> {
        return this.http.post<void>(`${this.visitUrl}/${visitId}/connections/${connectId}`, {})
            .pipe(getErrorHandler<void>(this.msg));
    }

    public getConnections(visitId: UUID): Observable<Array<Visit>> {
        return this.http.get<Array<Visit>>(`${this.visitUrl}/${visitId}/connections`)
            .pipe(getErrorHandler<Array<Visit>>(this.msg));
    }

    public deleteConnection(visitId: UUID, connectId: UUID): Observable<void> {
        return this.http.delete<void>(`${this.visitUrl}/${visitId}/connections/${connectId}`)
            .pipe(getErrorHandler<void>(this.msg));
    }

}
