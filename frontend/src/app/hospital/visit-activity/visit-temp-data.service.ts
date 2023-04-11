import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '@fe/environment';
import {Observable} from 'rxjs';
import {VisitTmpData} from '@shared/hospital-visit/visit-tmp-data';

@Injectable({providedIn: 'root'})
export class VisitTempDataService {

    constructor(private readonly http: HttpClient) {
    }

    private getTempDataUrl(visitId: string): string {
        return `${environment.baseURL}/hospital-visits/${visitId}/tmp`;
    }

    public set(visitId: string, key: string, value: VisitTmpData): Observable<string> {
        return this.http.post<string>(`${this.getTempDataUrl(visitId)}/${key}`, value);
    }

    public getTempData(visitId: string): Observable<Record<string, unknown>> {
        return this.http.get<Record<string, string>>(this.getTempDataUrl(visitId));
    }

    public removeAll(visitId: string): Observable<unknown> {
        return this.http.delete(this.getTempDataUrl(visitId));
    }

}
