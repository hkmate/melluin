import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {getErrorHandler} from '@fe/app/util/util';
import {MessageService} from '@fe/app/util/message.service';
import {AppConfig} from '@fe/app/config/app-config';
import {VisitedChild, VisitedChildEditInput, VisitedChildInput} from '@shared/hospital-visit/visited-child';

@Injectable({providedIn: 'root'})
export class VisitedChildService {

    constructor(private readonly http: HttpClient,
                private readonly msg: MessageService) {
    }

    private getChildrenUrl(visitId: string): string {
        return `${AppConfig.get('baseURL')}/hospital-visits/${visitId}/children`;
    }

    public add(visitId: string, data: VisitedChildInput): Observable<VisitedChild> {
        return this.http.post<VisitedChild>(this.getChildrenUrl(visitId), data)
            .pipe(getErrorHandler<VisitedChild>(this.msg));
    }

    public get(visitId: string): Observable<Array<VisitedChild>> {
        return this.http.get<Array<VisitedChild>>(this.getChildrenUrl(visitId))
            .pipe(getErrorHandler<Array<VisitedChild>>(this.msg));
    }

    public update(visitId: string, visitedChildId: string, childInput: VisitedChildEditInput): Observable<VisitedChild> {
        return this.http.put<VisitedChild>(`${this.getChildrenUrl(visitId)}/${visitedChildId}`, childInput)
            .pipe(getErrorHandler<VisitedChild>(this.msg));
    }

    public delete(visitId: string, visitedChildId: string): Observable<void> {
        return this.http.delete<void>(`${this.getChildrenUrl(visitId)}/${visitedChildId}`)
            .pipe(getErrorHandler<void>(this.msg));
    }

}
