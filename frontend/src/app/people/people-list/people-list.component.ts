import {Component, OnInit} from '@angular/core';
import {Pageable, PageQuery} from '@shared/api-util/pageable';
import {Person} from '@shared/person/person';
import {PeopleService} from '@fe/app/people/people.service';
import {AppTitle} from '@fe/app/app-title.service';
import {PageEvent} from '@angular/material/paginator';
import {SortOptions} from '@shared/api-util/sort-options';
import {FilterOptions} from '@shared/api-util/filter-options';
import {isNilOrEmpty} from '@shared/util/util';
import {TableDataSource} from '@fe/app/util/table-data-source';
import {UrlParamHandler} from '@fe/app/util/url-param-handler/url-param-handler';


@Component({
    selector: 'app-people-list',
    templateUrl: './people-list.component.html',
    styleUrls: ['./people-list.component.scss'],
    providers: [UrlParamHandler]
})
export class PeopleListComponent implements OnInit {

    private static readonly FIRST_PAGE = 1;
    private static readonly PAGE_PARAM_KEY = 'page';
    private static readonly SIZE_PARAM_KEY = 'size';
    private static readonly FILTER_PARAM_KEY = 'filter';

    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    protected readonly sizeOptions = [10, 20, 50];
    protected readonly columns = ['name', 'email', 'phone', 'options'];

    protected tableDataSource = new TableDataSource<Person>();
    protected page: number;
    protected size: number;
    protected countOfAll: number;
    protected filterWord?: string;
    private sort: SortOptions = {
        lastName: 'ASC'
    };

    constructor(private readonly title: AppTitle,
                private readonly peopleService: PeopleService,
                private readonly urlParam: UrlParamHandler) {
    }

    public ngOnInit(): void {
        this.title.setTitleByI18n('Titles.PeopleList');
        const page = this.urlParam.getNumberParam(PeopleListComponent.PAGE_PARAM_KEY) ?? PeopleListComponent.FIRST_PAGE;
        const size = this.urlParam.getNumberParam(PeopleListComponent.SIZE_PARAM_KEY) ?? this.sizeOptions[0];
        this.filterWord = this.urlParam.getParam(PeopleListComponent.FILTER_PARAM_KEY);
        this.loadData(page, size);
    }

    protected paginateHappened(event: PageEvent): void {
        this.page = event.pageIndex + 1;
        this.size = event.pageSize;
        this.urlParam.setParams({
            [PeopleListComponent.PAGE_PARAM_KEY]: this.page + '',
            [PeopleListComponent.SIZE_PARAM_KEY]: this.size + ''
        });
        this.loadData();
    }

    protected filterChanged(newFilterWord: string): void {
        this.filterWord = newFilterWord;
        this.urlParam.setParam(PeopleListComponent.FILTER_PARAM_KEY, this.filterWord);
        this.loadData();
    }

    private loadData(page?: number, size?: number): void {
        this.peopleService.findPeople(this.createPageRequest(page, size)).subscribe(
            (page: Pageable<Person>) => {
                this.tableDataSource.emit(page.items);
                this.page = page.meta.currentPage;
                this.countOfAll = page.meta.totalItems!;
                this.size = page.meta.itemsPerPage;
            }
        );
    }

    private createPageRequest(pageIndex?: number, pageSize?: number): PageQuery {
        return {
            page: pageIndex ?? this.page,
            size: pageSize ?? this.size,
            sort: this.sort,
            where: this.createWhereClosure()
        };
    }

    private createWhereClosure(): FilterOptions | undefined {
        if (isNilOrEmpty(this.filterWord)) {
            return undefined;
        }
        const likeExpr = `%${this.filterWord}%`;
        return [
            {firstName: {operator: 'ilike', operand: likeExpr}},
            {lastName: {operator: 'ilike', operand: likeExpr}},
            {email: {operator: 'ilike', operand: likeExpr}},
            {phone: {operator: 'ilike', operand: likeExpr}}
        ];
    }

}
