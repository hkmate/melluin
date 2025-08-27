import {Component, effect, inject, input} from '@angular/core';
import {DepartmentBoxStatus} from '@shared/department/box/department-box-status';
import {Pageable} from '@shared/api-util/pageable';
import {DepartmentBoxService} from '@fe/app/hospital/department-box/department-box.service';
import {DepartmentBoxInfoListComponent} from '@fe/app/hospital/department-box/department-box-info-list/department-box-info-list.component';

@Component({
    selector: 'app-box-info-list-by-department',
    templateUrl: './department-box-info-list.component.html',
    styleUrls: ['./department-box-info-list.component.scss']
})
export class BoxInfoListByDepartmentComponent extends DepartmentBoxInfoListComponent {

    private readonly boxStatusService = inject(DepartmentBoxService);

    public readonly departmentId = input.required<string>();

    constructor() {
        super();
        effect(() => this.loadData());
    }

    protected override loadData(): void {
        this.boxStatusService.findBoxStatusesByDepartment(this.departmentId(), this.createPageRequest(this.page, this.size)).subscribe(
            (page: Pageable<DepartmentBoxStatus>) => {
                this.boxInfoList = page.items;
                this.page = page.meta.currentPage;
                this.countOfAll = page.meta.totalItems!;
                this.size = page.meta.itemsPerPage;
            }
        );
    }

}
