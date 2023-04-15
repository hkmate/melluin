import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {PAGE_QUERY_KEY, PAGE_SIZE_QUERY_KEY, Pageable, PageQuery, QUERY_QUERY_KEY} from '@shared/api-util/pageable';
import {Observable} from 'rxjs';
import {Person} from '@shared/person/person';
import {environment} from '@fe/environment';
import {PersonCreation} from '@shared/person/person-creation';
import {PersonRewrite} from '@shared/person/person-rewrite';
import {getErrorHandler, utf8ToBase64} from '@fe/app/util/util';
import {MessageService} from '@fe/app/util/message.service';


@Injectable({providedIn: 'root'})
export class PeopleService {

    constructor(private readonly http: HttpClient,
                private readonly msg: MessageService) {
    }

    private get peopleUrl(): string {
        return `${environment.baseURL}/people`;
    }

    public addPerson(data: PersonCreation): Observable<Person> {
        return this.http.post<Person>(this.peopleUrl, data)
            .pipe(getErrorHandler<Person>(this.msg));
    }

    public getPerson(personId: string): Observable<Person> {
        return this.http.get<Person>(`${this.peopleUrl}/${personId}`)
            .pipe(getErrorHandler<Person>(this.msg));
    }

    public updatePerson(personId: string, data: PersonRewrite): Observable<Person> {
        return this.http.put<Person>(`${this.peopleUrl}/${personId}`, data)
            .pipe(getErrorHandler<Person>(this.msg));
    }

    public findPeople(filters: PageQuery): Observable<Pageable<Person>> {
        // TODO: remove debug when we'll use query expressions instead of base64 encoded json.
        console.debug('PageRequest to send: ', filters);
        return this.http.get<Pageable<Person>>(this.peopleUrl, {
            params: {
                [PAGE_QUERY_KEY]: filters.page,
                [PAGE_SIZE_QUERY_KEY]: filters.size,
                [QUERY_QUERY_KEY]: this.preparePageRequest({sort: filters.sort, where: filters.where})
            }
        })
            .pipe(getErrorHandler<Pageable<Person>>(this.msg));
    }

    private preparePageRequest(pageRequest: Partial<PageQuery>): string {
        return utf8ToBase64(JSON.stringify(pageRequest));
    }

}
