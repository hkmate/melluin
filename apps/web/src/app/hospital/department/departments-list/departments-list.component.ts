import {Component, effect, inject, signal} from '@angular/core';
import {
    ConjunctionFilterOptions,
    Department,
    FilterOptions,
    isEmpty,
    isNil,
    isNilOrEmpty,
    PAGE_QUERY_KEY,
    PAGE_SIZE_QUERY_KEY,
    Pageable,
    PageQuery,
    Permission,
    SortOptions
} from '@melluin/common';
import {AppTitle} from '@fe/app/app-title.service';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {DepartmentService} from '@fe/app/hospital/department/department.service';
import {PermissionService} from '@fe/app/auth/service/permission.service';
import {UrlParamHandler} from '@fe/app/util/url-param-handler/url-param-handler';
import {TranslatePipe} from '@ngx-translate/core';
import {LazyInputComponent2} from '@fe/app/util/lazy-input/lazy-input.component';
import {MatIconButton, MatMiniFabButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {RouterLink} from '@angular/router';
import {
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatFooterCell,
    MatFooterCellDef,
    MatFooterRow,
    MatFooterRowDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatTable
} from '@angular/material/table';
import {DatePipe} from '@angular/common';
import {MatSlideToggle} from '@angular/material/slide-toggle';
import {FormsModule} from '@angular/forms';

const FIRST_PAGE = 1;
const FILTER_PARAM_KEY = 'filter';
const ONLY_VALID_PARAM_KEY = 'only-valid';

@Component({
    imports: [
        TranslatePipe,
        LazyInputComponent2,
        MatMiniFabButton,
        MatIcon,
        RouterLink,
        MatTable,
        MatColumnDef,
        MatHeaderCell,
        MatCell,
        MatCellDef,
        MatHeaderCellDef,
        DatePipe,
        MatIconButton,
        MatFooterCell,
        MatFooterCellDef,
        MatSlideToggle,
        FormsModule,
        MatHeaderRow,
        MatRow,
        MatFooterRow,
        MatPaginator,
        MatFooterRowDef,
        MatHeaderRowDef,
        MatRowDef
    ],
    selector: 'app-department-list',
    templateUrl: './departments-list.component.html',
    styleUrls: ['./departments-list.component.scss'],
    providers: [UrlParamHandler]
})
export class DepartmentsListComponent {

    Permission = Permission;

    private readonly title = inject(AppTitle);
    protected readonly permissions = inject(PermissionService);
    private readonly departmentService = inject(DepartmentService);
    private readonly urlParam = inject(UrlParamHandler);

    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    protected readonly sizeOptions = [10, 20, 50];
    protected readonly columns = ['name', 'address', 'city', 'validFrom', 'validTo', 'options'];

    protected readonly items = signal<Array<Department>>([]);
    protected readonly filterWord = signal(this.urlParam.getParam(FILTER_PARAM_KEY) ?? '');
    protected readonly onlyValid = signal(this.urlParam.getParam(ONLY_VALID_PARAM_KEY) !== 'false');
    protected readonly page = signal(this.urlParam.getNumberParam(PAGE_QUERY_KEY) ?? FIRST_PAGE);
    protected readonly size = signal(this.urlParam.getNumberParam(PAGE_SIZE_QUERY_KEY) ?? this.sizeOptions[2]);
    protected readonly countOfAll = signal(0);

    private readonly now = new Date().toISOString();
    private readonly sort: SortOptions = {
        name: 'ASC'
    };

    constructor() {
        this.title.setTitleByI18n('Titles.DepartmentList')
        effect(() => {
            this.urlParam.setParam(FILTER_PARAM_KEY, this.filterWord());
            this.urlParam.setParam(ONLY_VALID_PARAM_KEY, this.onlyValid());
            this.loadData();
        });
    }

    protected isEditEnabled(department: Department): boolean {
        return this.permissions.has(Permission.canWriteDepartment)
            && this.isValid(department);
    }

    protected paginateHappened(event: PageEvent): void {
        this.page.set(event.pageIndex + 1);
        this.size.set(event.pageSize);
        this.urlParam.setParams({
            [PAGE_QUERY_KEY]: this.page() + '',
            [PAGE_SIZE_QUERY_KEY]: this.size() + ''
        });
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
                this.page.set(page.meta.currentPage);
                this.countOfAll.set(page.meta.totalItems!);
                this.size.set(page.meta.itemsPerPage);
            }
        );
    }

    private createPageRequest(pageIndex?: number, pageSize?: number): PageQuery {
        return {
            page: pageIndex ?? this.page(),
            size: pageSize ?? this.size(),
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
        if (isNilOrEmpty(this.filterWord())) {
            return [];
        }
        const likeExpr = `%${this.filterWord()}%`;
        return [
            {name: {operator: 'ilike', operand: likeExpr}},
            {address: {operator: 'ilike', operand: likeExpr}}
        ];
    }

    private addValidityFilters(previousFilters: Array<ConjunctionFilterOptions>): Array<ConjunctionFilterOptions> {
        if (!this.onlyValid()) {
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
