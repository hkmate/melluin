import {DepartmentBoxStatus} from '@shared/department/box/department-box-status';
import {PageEvent} from '@angular/material/paginator';
import {PageQuery} from '@shared/api-util/pageable';
import {isNilOrEmpty} from '@shared/util/util';


export abstract class DepartmentBoxInfoListComponent {

    protected static readonly FIRST_PAGE = 1;

    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    protected readonly sizeOptions = [5, 10, 20];
    protected boxInfoList: Array<DepartmentBoxStatus>;
    protected page: number = DepartmentBoxInfoListComponent.FIRST_PAGE;
    protected size: number = this.sizeOptions[0];
    protected countOfAll: number;
    protected paginatorNeeded = true;

    public reload(): void {
        this.loadData();
    }

    protected abstract loadData(): void;

    protected paginateHappened(event: PageEvent): void {
        this.page = event.pageIndex + 1;
        this.size = event.pageSize;
        this.loadData();
    }

    protected isEmpty(): boolean {
        return isNilOrEmpty(this.boxInfoList);
    }

    protected createPageRequest(pageIndex?: number, pageSize?: number): PageQuery {
        return {
            page: pageIndex ?? this.page,
            size: pageSize ?? this.size,
            sort: {
                dateTime: 'DESC'
            }
        };
    }

}
