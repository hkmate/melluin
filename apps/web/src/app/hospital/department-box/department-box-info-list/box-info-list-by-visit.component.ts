import {Component, effect, inject, input} from '@angular/core';
import {DepartmentBoxStatus, UUID} from '@melluin/common';
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
    selector: 'app-box-info-list-by-visit',
    templateUrl: './department-box-info-list.component.html',
    styleUrls: ['./department-box-info-list.component.scss']
})
export class BoxInfoListByVisitComponent extends DepartmentBoxInfoListComponent {

    private readonly boxStatusService = inject(DepartmentBoxService);

    public readonly visitId = input.required<UUID>();

    constructor() {
        super();
        this.paginatorNeeded.set(false);
        effect(() => this.loadData());
    }

    protected override loadData(): void {
        this.boxStatusService.findBoxStatusesByVisit(this.visitId()).subscribe(
            (items: Array<DepartmentBoxStatus>) => {
                this.boxInfoList.set(items);
            }
        );
    }

}
