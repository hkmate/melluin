import {inject, Injectable} from '@angular/core';
import {map, mergeMap, Observable, of, tap} from 'rxjs';
import {PersonIdentifier} from '@shared/person/person';
import {PeopleService} from '@fe/app/people/people.service';
import {FilteringInfo, Pageable} from '@shared/api-util/pageable';
import {isNilOrEmpty} from '@shared/util/util';


@Injectable({providedIn: 'root'})
export class CachedPeopleService {

    private static readonly MAX_SIZE_OF_DATA = 100;

    private readonly personService = inject(PeopleService);

    public loadAllPeople(query: FilteringInfo, cacheName: string): Observable<Array<PersonIdentifier>> {
        const cached = this.getFromCache(cacheName);
        if (!isNilOrEmpty(cached)) {
            return of(cached);
        }
        return this.loadPeopleToStorage(query, cacheName).pipe(map(() => this.getFromCache(cacheName)));
    }

    private loadPeopleToStorage(query: FilteringInfo, cacheName: string, page: number = 1): Observable<unknown> {
        return this.personService.findPeopleIdentifiers({page, size: CachedPeopleService.MAX_SIZE_OF_DATA, ...query})
            .pipe(
                tap((pageable: Pageable<PersonIdentifier>) => this.addToCache(cacheName, pageable.items)),
                mergeMap((pageable: Pageable<PersonIdentifier>) =>
                    (this.isLastPage(pageable) ? of({}) : this.loadPeopleToStorage(query, cacheName, page + 1)))
            );
    }

    private addToCache(cacheName: string, value: Array<PersonIdentifier>): void {
        const alreadyPersisted = this.getFromCache(cacheName);
        sessionStorage.setItem(cacheName, JSON.stringify([...alreadyPersisted, ...value]));
    }

    private getFromCache(cacheName: string): Array<PersonIdentifier> {
        return JSON.parse(sessionStorage.getItem(cacheName) ?? '[]');
    }

    private isLastPage<T>(pageable: Pageable<T>): boolean {
        return pageable.meta.currentPage === pageable.meta.totalPages;
    }

}
