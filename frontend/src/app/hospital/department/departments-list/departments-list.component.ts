import {Component, OnInit} from '@angular/core';
import {Pageable, PageQuery} from '@shared/api-util/pageable';
import {AppTitle} from '@fe/app/app-title.service';
import {PageEvent} from '@angular/material/paginator';
import {SortOptions} from '@shared/api-util/sort-options';
import {ConjunctionFilterOptions, FilterOptions} from '@shared/api-util/filter-options';
import {isEmpty, isNil, isNilOrEmpty} from '@shared/util/util';
import {TableDataSource} from '@fe/app/util/table-data-source';
import {Department} from '@shared/department/department';
import {DepartmentService} from '@fe/app/hospital/department/department.service';

@Component({
    selector: 'app-department-list',
    templateUrl: './departments-list.component.html',
    styleUrls: ['./departments-list.component.scss']
})
export class DepartmentsListComponent implements OnInit {

    private static readonly FIRST_PAGE = 1;

    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    protected readonly sizeOptions = [10, 20, 50];
    protected readonly columns = ['name', 'address', 'validFrom', 'validTo', 'options'];

    protected tableDataSource = new TableDataSource<Department>();
    protected page: number;
    protected size: number;
    protected countOfAll: number;
    protected filterWord: string;
    protected onlyValid = true;
    private now = new Date().toISOString();
    private sort: SortOptions = {
        name: 'ASC'
    };

    constructor(private readonly title: AppTitle,
                private readonly departmentService: DepartmentService) {
    }

    public ngOnInit(): void {
        this.title.setTitleByI18n('Titles.DepartmentList')
        this.loadData(DepartmentsListComponent.FIRST_PAGE, this.sizeOptions[0]);
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

    protected optionChanged(): void {
        this.loadData();
    }

    protected isValid(department: Department): boolean {
        if (isNil(department.validTo)) {
            return true;
        }
        return this.now < department.validTo;
    }

    private loadData(page?: number, size?: number): void {
        this.departmentService.findDepartments(this.createPageRequest(page, size)).subscribe(
            (page: Pageable<Department>) => {
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
        let filters = this.createTextFilter();
        filters = this.addValidityFilters(filters);
        return isEmpty(filters) ? undefined : filters;
    }


    private createTextFilter(): Array<ConjunctionFilterOptions> {
        if (isNilOrEmpty(this.filterWord)) {
            return [];
        }
        const likeExpr = `%${this.filterWord}%`;
        return [
            {name: {operator: 'ilike', operand: likeExpr}},
            {address: {operator: 'ilike', operand: likeExpr}}
        ];
    }

    private addValidityFilters(previousFilters: Array<ConjunctionFilterOptions>): Array<ConjunctionFilterOptions> {
        if (!this.onlyValid) {
            return previousFilters;
        }
        const prev = isEmpty(previousFilters) ? [{}] : previousFilters;
        const validityFilters = {
            validFrom: {operator: 'lte', operand: this.now},
            validTo: {operator: 'gte', operand: this.now}
        };
        return prev.map(filter => Object.assign(filter, validityFilters));
    }

}
