import {Component, inject, signal} from '@angular/core';
import {Pageable, PageQuery} from '@shared/api-util/pageable';
import {AppTitle} from '@fe/app/app-title.service';
import {PageEvent} from '@angular/material/paginator';
import {SortOptions} from '@shared/api-util/sort-options';
import {ConjunctionFilterOptions, FilterOptions} from '@shared/api-util/filter-options';
import {isEmpty, isNil, isNilOrEmpty} from '@shared/util/util';
import {Department} from '@shared/department/department';
import {DepartmentService} from '@fe/app/hospital/department/department.service';
import {Permission} from '@shared/user/permission.enum';
import {PermissionService} from '@fe/app/auth/service/permission.service';
import {UrlParamHandler} from '@fe/app/util/url-param-handler/url-param-handler';

@Component({
    selector: 'app-department-list',
    templateUrl: './departments-list.component.html',
    styleUrls: ['./departments-list.component.scss'],
    providers: [UrlParamHandler]
})
export class DepartmentsListComponent {

    Permission = Permission;
    private static readonly FIRST_PAGE = 1;
    private static readonly PAGE_PARAM_KEY = 'page';
    private static readonly SIZE_PARAM_KEY = 'size';
    private static readonly FILTER_PARAM_KEY = 'filter';
    private static readonly ONLY_VALID_PARAM_KEY = 'only-valid';

    private readonly title = inject(AppTitle);
    protected readonly permissions = inject(PermissionService);
    private readonly departmentService = inject(DepartmentService);
    private readonly urlParam = inject(UrlParamHandler);

    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    protected readonly sizeOptions = [10, 20, 50];
    protected readonly columns = ['name', 'address', 'validFrom', 'validTo', 'options'];

    protected readonly items = signal<Array<Department>>([]);
    protected page: number;
    protected size: number;
    protected countOfAll: number;
    protected filterWord?: string;
    protected onlyValid = true;
    private now = new Date().toISOString();
    private sort: SortOptions = {
        name: 'ASC'
    };

    constructor() {
        this.title.setTitleByI18n('Titles.DepartmentList')
        this.page = this.urlParam.getNumberParam(DepartmentsListComponent.PAGE_PARAM_KEY) ?? DepartmentsListComponent.FIRST_PAGE;
        this.size = this.urlParam.getNumberParam(DepartmentsListComponent.SIZE_PARAM_KEY) ?? this.sizeOptions[2];
        this.filterWord = this.urlParam.getParam(DepartmentsListComponent.FILTER_PARAM_KEY);
        this.onlyValid = this.urlParam.getParam(DepartmentsListComponent.ONLY_VALID_PARAM_KEY) !== 'false';
        this.loadData();
    }

    protected isEditEnabled(department: Department): boolean {
        return this.permissions.has(Permission.canWriteDepartment)
            && this.isValid(department);
    }

    protected paginateHappened(event: PageEvent): void {
        this.page = event.pageIndex + 1;
        this.size = event.pageSize;
        this.urlParam.setParams({
            [DepartmentsListComponent.PAGE_PARAM_KEY]: this.page + '',
            [DepartmentsListComponent.SIZE_PARAM_KEY]: this.size + ''
        });
        this.loadData();
    }

    protected filterChanged(newFilterWord: string): void {
        this.filterWord = newFilterWord;
        this.urlParam.setParam(DepartmentsListComponent.FILTER_PARAM_KEY, this.filterWord);
        this.loadData();
    }

    protected optionChanged(): void {
        this.urlParam.setParam(DepartmentsListComponent.ONLY_VALID_PARAM_KEY, this.onlyValid);
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
                this.items.set(page.items);
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
