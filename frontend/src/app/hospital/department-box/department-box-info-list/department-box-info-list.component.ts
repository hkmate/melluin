import {Component, Input} from '@angular/core';
import {DepartmentBoxStatus} from '@shared/department/box/department-box-status';
import {PageEvent} from '@angular/material/paginator';
import {Pageable, PageQuery} from '@shared/api-util/pageable';
import {DepartmentBoxService} from '@fe/app/hospital/department-box/department-box.service';
import {isNilOrEmpty} from '@shared/util/util';

@Component({
    selector: 'app-department-box-info-list',
    templateUrl: './department-box-info-list.component.html',
    styleUrls: ['./department-box-info-list.component.scss']
})
export class DepartmentBoxInfoListComponent {

    private static readonly FIRST_PAGE = 1;

    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    protected readonly sizeOptions = [5, 10, 20];
    protected boxInfoList: Array<DepartmentBoxStatus>;
    protected page: number;
    protected size: number;
    protected countOfAll: number;
    private depId: string;

    constructor(private readonly boxStatusService: DepartmentBoxService) {
    }

    @Input()
    public set departmentId(departmentId: string) {
        this.depId = departmentId;
        this.loadData(DepartmentBoxInfoListComponent.FIRST_PAGE, this.sizeOptions[0]);
    }

    protected paginateHappened(event: PageEvent): void {
        this.page = event.pageIndex + 1;
        this.size = event.pageSize;
        this.loadData();
    }

    protected isEmpty(): boolean {
        return isNilOrEmpty(this.boxInfoList);
    }

    private loadData(page?: number, size?: number): void {
        this.boxStatusService.findBoxStatuses(this.depId, this.createPageRequest(page, size)).subscribe(
            (page: Pageable<DepartmentBoxStatus>) => {
                this.boxInfoList = page.items;
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
            sort: {
                dateTime: 'DESC'
            }
        };
    }

}
