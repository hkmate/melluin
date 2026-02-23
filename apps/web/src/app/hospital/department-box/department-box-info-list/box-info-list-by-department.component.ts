import {Component, effect, inject, input} from '@angular/core';
import {DepartmentBoxStatus, Pageable} from '@melluin/common';
import {DepartmentBoxService} from '@fe/app/hospital/department-box/department-box.service';
import {DepartmentBoxInfoListComponent} from '@fe/app/hospital/department-box/department-box-info-list/department-box-info-list.component';
import {DepartmentBoxInfoComponent} from '@fe/app/hospital/department-box/department-box-info/department-box-info.component';
import {MatPaginator} from '@angular/material/paginator';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
    selector: 'app-box-info-list-by-department',
    templateUrl: './department-box-info-list.component.html',
    imports: [
        DepartmentBoxInfoComponent,
        MatPaginator,
        TranslatePipe
    ],
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
