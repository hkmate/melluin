import {DepartmentBoxStatus, isNilOrEmpty, PageQuery} from '@melluin/common';
import {PageEvent} from '@angular/material/paginator';
import {computed, signal} from '@angular/core';


export abstract class DepartmentBoxInfoListComponent {

    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    protected readonly sizeOptions = [5, 10, 20];
    protected static readonly FIRST_PAGE = 1;

    protected readonly boxInfoList = signal<Array<DepartmentBoxStatus>>([]);
    protected readonly page = signal(DepartmentBoxInfoListComponent.FIRST_PAGE);
    protected readonly size = signal(this.sizeOptions[0]);
    protected readonly countOfAll = signal(0);
    protected readonly paginatorNeeded = signal(true);
    protected readonly isListEmpty = computed(() => isNilOrEmpty(this.boxInfoList()));

    public addNewItemToFrontOfList(item: DepartmentBoxStatus): void {
        this.boxInfoList.update(list => [item, ...list]);
    }

    protected abstract loadData(): void;

    protected paginateHappened(event: PageEvent): void {
        this.page.set(event.pageIndex + 1);
        this.size.set(event.pageSize);
        this.loadData();
    }

    protected createPageRequest(pageIndex?: number, pageSize?: number): PageQuery {
        return {
            page: pageIndex ?? this.page(),
            size: pageSize ?? this.size(),
            sort: {
                dateTime: 'DESC'
            }
        };
    }

}
