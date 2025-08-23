import {Injectable} from '@angular/core';
import {isNil, isNilOrEmpty} from '@shared/util/util';
import {UrlParamHandler} from '@fe/app/util/url-param-handler/url-param-handler';
import {PAGE_QUERY_KEY, PAGE_SIZE_QUERY_KEY, PageInfo} from '@shared/api-util/pageable';
import {PeopleFilter} from '@fe/app/people/people-list/people-list-filter/service/people-filter';
import {PeopleListQueryParams} from '@fe/app/people/people-list/people-list-filter/service/people-list-query-params';


@Injectable()
export class PeopleListQueryParamSettingsInitializer {

    constructor(private readonly urlParamHandler: UrlParamHandler) {
    }

    public getFilters(): PeopleFilter {
        const result = this.getDefaultFilter();
        this.decorateDefault(result);
        return result;
    }

    public getPageInfo(): PageInfo {
        const result = {page: 1, size: 50};
        this.decoratePageNumber(result);
        this.decoratePageSize(result);
        return result;
    }

    private getDefaultFilter(): PeopleFilter {
        const result = new PeopleFilter();
        result.name = '';
        result.email = '';
        result.phone = '';
        result.onlyActive = false;
        result.roleNames = [];
        return result;
    }

    private decorateDefault(filters: PeopleFilter): void {
        this.decorateNameFilter(filters);
        this.decorateEmailFilter(filters);
        this.decoratePhoneFilter(filters);
        this.decorateRoleNamesFilter(filters);
        this.decorateIsActive(filters);
    }

    private decorateNameFilter(filter: PeopleFilter): void {
        const name = this.urlParamHandler.getParam(PeopleListQueryParams.name);
        if (isNil(name)) {
            return;
        }
        filter.name = name;
    }

    private decorateEmailFilter(filter: PeopleFilter): void {
        const email = this.urlParamHandler.getParam(PeopleListQueryParams.email);
        if (isNil(email)) {
            return;
        }
        filter.email = email;
    }

    private decoratePhoneFilter(filter: PeopleFilter): void {
        const phone = this.urlParamHandler.getParam(PeopleListQueryParams.phone);
        if (isNil(phone)) {
            return;
        }
        filter.phone = phone;
    }

    private decorateRoleNamesFilter(filter: PeopleFilter): void {
        const roles = this.urlParamHandler.getParams(PeopleListQueryParams.role);
        if (isNilOrEmpty(roles)) {
            return;
        }
        filter.roleNames = roles!;
    }

    private decorateIsActive(preferences: PeopleFilter): void {
        const onlyActive = this.urlParamHandler.getParam(PeopleListQueryParams.onlyActive);
        if (isNil(onlyActive)) {
            return;
        }
        preferences.onlyActive = (onlyActive.toLowerCase() === 'true');
    }

    private decoratePageNumber(pageInfo: PageInfo): void {
        const page = this.urlParamHandler.getNumberParam(PAGE_QUERY_KEY);
        if (isNil(page)) {
            return;
        }
        pageInfo.page = page;
    }

    private decoratePageSize(pageInfo: PageInfo): void {
        const size = this.urlParamHandler.getNumberParam(PAGE_SIZE_QUERY_KEY);
        if (isNil(size)) {
            return;
        }
        pageInfo.size = size;
    }

}
