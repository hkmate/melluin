import {inject, Injectable} from '@angular/core';
import {firstValueFrom} from 'rxjs';
import {FilteringInfo, isNil, isNotNil, Pageable, PersonIdentifier} from '@melluin/common';
import {PeopleService} from '@fe/app/people/people.service';

const MAX_PAGE_SIZE = 100;

@Injectable({providedIn: 'root'})
export class CachedPeopleService {

    private readonly personService = inject(PeopleService);

    public async loadAllPeople(query: FilteringInfo, cacheName: string): Promise<Array<PersonIdentifier>> {
        const storedList = this.getFromCache(cacheName);
        if (isNotNil(storedList)) {
            return storedList;
        }
        const loadedPeople = await this.loadAllPeopleListFromPage(query);
        sessionStorage.setItem(cacheName, JSON.stringify(loadedPeople));
        return loadedPeople;
    }

    private async loadAllPeopleListFromPage(query: FilteringInfo, pageNumber = 1): Promise<Array<PersonIdentifier>> {
        const page = await this.loadPeoplePage(query, pageNumber);
        if (this.isLastPage(page)) {
            return page.items;
        }
        const peopleFromOtherPages = await this.loadAllPeopleListFromPage(query, pageNumber + 1);
        return [...page.items, ...peopleFromOtherPages];
    }

    private loadPeoplePage(query: FilteringInfo, page: number): Promise<Pageable<PersonIdentifier>> {
        return firstValueFrom(
            this.personService.findPeopleIdentifiers({page, size: MAX_PAGE_SIZE, ...query})
        );
    }

    private getFromCache(cacheName: string): Array<PersonIdentifier> | undefined {
        const storedData = sessionStorage.getItem(cacheName);
        if (isNil(storedData)) {
            return undefined;
        }
        return JSON.parse(storedData);
    }

    private isLastPage<T>(pageable: Pageable<T>): boolean {
        return pageable.meta.currentPage === pageable.meta.totalPages;
    }

}
