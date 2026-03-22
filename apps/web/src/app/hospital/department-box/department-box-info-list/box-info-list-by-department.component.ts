import {ChangeDetectionStrategy, Component, effect, inject, input} from '@angular/core';
import {DepartmentBoxStatus, Pageable, UUID} from '@melluin/common';
import {DepartmentBoxService} from '@fe/app/hospital/department-box/department-box.service';
import {DepartmentBoxInfoListComponent} from '@fe/app/hospital/department-box/department-box-info-list/department-box-info-list.component';
import {DepartmentBoxInfoComponent} from '@fe/app/hospital/department-box/department-box-info/department-box-info.component';
import {MatPaginator} from '@angular/material/paginator';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
    imports: [
        DepartmentBoxInfoComponent,
        MatPaginator,
        TranslatePipe
    ],
    selector: 'app-box-info-list-by-department',
    templateUrl: './department-box-info-list.component.html',
    styleUrls: ['./department-box-info-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoxInfoListByDepartmentComponent extends DepartmentBoxInfoListComponent {

    private readonly boxStatusService = inject(DepartmentBoxService);

    public readonly departmentId = input.required<UUID>();

    constructor() {
        super();
        effect(() => this.loadData());
    }

    protected override loadData(): void {
        this.boxStatusService.findBoxStatusesByDepartment(this.departmentId(), this.createPageRequest()).subscribe(
            (page: Pageable<DepartmentBoxStatus>) => {
                this.boxInfoList.set(page.items);
                this.page.set(page.meta.currentPage);
                this.countOfAll.set(page.meta.totalItems!);
                this.size.set(page.meta.itemsPerPage);
            }
        );
    }

}
