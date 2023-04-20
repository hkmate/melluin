import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ChildInput} from '@shared/child/child-input';
import {Child} from '@shared/child/child';
import {getErrorHandler} from '@fe/app/util/util';
import {MessageService} from '@fe/app/util/message.service';
import {AppConfig} from '@fe/app/config/app-config';

@Injectable({providedIn: 'root'})
export class ChildService {

    constructor(private readonly http: HttpClient,
                private readonly msg: MessageService) {
    }

    private get childrenUrl(): string {
        return `${AppConfig.get('baseURL')}/children`;
    }

    public add(data: ChildInput): Observable<Child> {
        return this.http.post<Child>(this.childrenUrl, data)
            .pipe(getErrorHandler<Child>(this.msg));
    }

    public get(childId: string): Observable<Child> {
        return this.http.get<Child>(`${this.childrenUrl}/${childId}`)
            .pipe(getErrorHandler<Child>(this.msg));
    }

}
