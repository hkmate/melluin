import {Component, OnInit} from '@angular/core';
import {Pageable, PageQuery} from '@shared/api-util/pageable';
import {Person} from '@shared/person/person';
import {PeopleService} from '@fe/app/people/people.service';
import {AppTitle} from '@fe/app/app-title.service';
import {DataSource} from '@angular/cdk/collections';
import {BehaviorSubject, Observable} from 'rxjs';
import {PageEvent} from '@angular/material/paginator';
import {SortOptions} from '@shared/api-util/sort-options';
import {FilterOptions} from '@shared/api-util/filter-options';
import {isNilOrEmpty} from '@shared/util/util';


class PersonDataSource extends DataSource<Person> {

    private data = new BehaviorSubject<Array<Person>>([]);

    public emit(dataToEmit: Array<Person>): void {
        this.data.next(dataToEmit)
    }

    public override connect(): Observable<Array<Person>> {
        return this.data;
    }

    public override disconnect(): void {
    }

}

@Component({
    selector: 'app-people-list',
    templateUrl: './people-list.component.html',
    styleUrls: ['./people-list.component.scss']
})
export class PeopleListComponent implements OnInit {

    private static readonly FIRST_PAGE = 1;

    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    protected readonly sizeOptions = [10, 20, 50];
    protected readonly columns = ['name', 'email', 'phone', 'options'];

    protected tableDataSource = new PersonDataSource();
    protected page: number;
    protected size: number;
    protected countOfAll: number;
    protected filterWord: string;
    private sort: SortOptions = {
        lastName: 'ASC'
    };

    constructor(private readonly title: AppTitle,
                private readonly peopleService: PeopleService) {
    }

    public ngOnInit(): void {
        this.title.setTitleByI18n('Titles.PeopleList')
        this.loadData(PeopleListComponent.FIRST_PAGE, this.sizeOptions[0]);
    }

    protected paginateHappened(event: PageEvent): void {
        this.page = event.pageIndex + 1;
        this.size = event.pageSize;
        this.loadData();
    }

    protected filterChanged(newFilterWord: string): void {
        this.filterWord = newFilterWord;
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
