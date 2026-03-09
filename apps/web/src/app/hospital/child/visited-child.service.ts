import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {getErrorHandler} from '@fe/app/util/util';
import {MessageService} from '@fe/app/util/message.service';
import {UUID, VisitedChild, VisitedChildEditInput, VisitedChildInput} from '@melluin/common';
import {environment} from '@fe/environment';

@Injectable({providedIn: 'root'})
export class VisitedChildService {

    private readonly http = inject(HttpClient);
    private readonly msg = inject(MessageService);

    private getChildrenUrl(visitId: UUID): string {
        return `${environment.baseURL}/visits/${visitId}/children`;
    }

    public add(visitId: UUID, data: VisitedChildInput): Observable<VisitedChild> {
        return this.http.post<VisitedChild>(this.getChildrenUrl(visitId), data)
            .pipe(getErrorHandler<VisitedChild>(this.msg));
    }

    public get(visitId: UUID): Observable<Array<VisitedChild>> {
        return this.http.get<Array<VisitedChild>>(this.getChildrenUrl(visitId))
            .pipe(getErrorHandler<Array<VisitedChild>>(this.msg));
    }

    public update(visitId: UUID, visitedChildId: UUID, childInput: VisitedChildEditInput): Observable<VisitedChild> {
        return this.http.put<VisitedChild>(`${this.getChildrenUrl(visitId)}/${visitedChildId}`, childInput)
            .pipe(getErrorHandler<VisitedChild>(this.msg));
    }

    public delete(visitId: UUID, visitedChildId: UUID): Observable<void> {
        return this.http.delete<void>(`${this.getChildrenUrl(visitId)}/${visitedChildId}`)
            .pipe(getErrorHandler<void>(this.msg));
    }

}
