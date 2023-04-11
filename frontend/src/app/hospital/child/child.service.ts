import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '@fe/environment';
import {Observable} from 'rxjs';
import {ChildInput} from '@shared/child/child-input';
import {Child} from '@shared/child/child';

@Injectable({providedIn: 'root'})
export class ChildService {

    constructor(private readonly http: HttpClient) {
    }

    private get childrenUrl(): string {
        return `${environment.baseURL}/children`;
    }

    public add(data: ChildInput): Observable<Child> {
        return this.http.post<Child>(this.childrenUrl, data);
    }

    public get(childId: string): Observable<Child> {
        return this.http.get<Child>(`${this.childrenUrl}/${childId}`);
    }

}
