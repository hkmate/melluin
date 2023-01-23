import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Pageable, PageRequest} from '@shared/api-util/pageable';
import {Observable} from 'rxjs';
import {Person} from '@shared/person/person';
import {environment} from '@fe/environment';


@Injectable({providedIn: 'root'})
export class PeopleService {

    constructor(private readonly http: HttpClient) {
    }

    private get peopleUrl(): string {
        return `${environment.baseURL}/people`;
    }

    public findPeople(filters: PageRequest): Observable<Pageable<Person>> {
        // TODO: remove debug when we'll use query expressions instead of base64 encoded json.
        console.debug('PageRequest to send: ', filters);
        return this.http.get<Pageable<Person>>(this.peopleUrl, {
            params: {query: this.preparePageRequest(filters)}
        });
    }

    private preparePageRequest(pageRequest: PageRequest): string {
        return btoa(JSON.stringify(pageRequest));
    }

}
