import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {
    PAGE_QUERY_KEY,
    PAGE_SIZE_QUERY_KEY,
    Pageable,
    PageQuery,
    Person,
    PersonCreation,
    PersonIdentifier,
    PersonRewrite, UUID
} from '@melluin/common';
import {Observable} from 'rxjs';
import {getErrorHandler} from '@fe/app/util/error/error-handler';
import {MessageService} from '@fe/app/util/message.service';
import {environment} from '@fe/environment';


@Injectable({providedIn: 'root'})
export class PeopleService {

    private readonly http = inject(HttpClient);
    private readonly msg = inject(MessageService);

    private get peopleUrl(): string {
        return `${environment.baseURL}/people`;
    }

    public addPerson(data: PersonCreation): Observable<Person> {
        return this.http.post<Person>(this.peopleUrl, data)
            .pipe(getErrorHandler<Person>(this.msg));
    }

    public getPerson(personId: UUID): Observable<Person> {
        return this.http.get<Person>(`${this.peopleUrl}/${personId}`)
            .pipe(getErrorHandler<Person>(this.msg));
    }

    public updatePerson(personId: UUID, data: PersonRewrite): Observable<Person> {
        return this.http.put<Person>(`${this.peopleUrl}/${personId}`, data)
            .pipe(getErrorHandler<Person>(this.msg));
    }

    public findPeopleIdentifiers(filters: PageQuery): Observable<Pageable<PersonIdentifier>> {
        return this.http.post<Pageable<PersonIdentifier>>(`${this.peopleUrl}/:list`,
            {sort: filters.sort, where: filters.where},
            {
                params: {
                    'onlyIdentifier': true,
                    [PAGE_QUERY_KEY]: filters.page,
                    [PAGE_SIZE_QUERY_KEY]: filters.size
                }
            })
            .pipe(getErrorHandler<Pageable<PersonIdentifier>>(this.msg));
    }

    public findPeople(filters: PageQuery): Observable<Pageable<Person>> {
        return this.http.post<Pageable<Person>>(`${this.peopleUrl}/:list`,
            {sort: filters.sort, where: filters.where},
            {
                params: {
                    [PAGE_QUERY_KEY]: filters.page,
                    [PAGE_SIZE_QUERY_KEY]: filters.size
                }
            })
            .pipe(getErrorHandler<Pageable<Person>>(this.msg));
    }

}
