import {Component, effect, inject, input} from '@angular/core';
import {DepartmentBoxStatus} from '@shared/department/box/department-box-status';
import {DepartmentBoxService} from '@fe/app/hospital/department-box/department-box.service';
import {DepartmentBoxInfoListComponent} from '@fe/app/hospital/department-box/department-box-info-list/department-box-info-list.component';

@Component({
    selector: 'app-box-info-list-by-visit',
    templateUrl: './department-box-info-list.component.html',
    styleUrls: ['./department-box-info-list.component.scss']
})
export class BoxInfoListByVisitComponent extends DepartmentBoxInfoListComponent {

    private readonly boxStatusService = inject(DepartmentBoxService);

    public readonly visitId = input.required<string>();

    constructor() {
        super();
        this.paginatorNeeded = false;
        effect(() => this.loadData());
    }

    protected override loadData(): void {
        this.boxStatusService.findBoxStatusesByVisit(this.visitId()).subscribe(
            (items: Array<DepartmentBoxStatus>) => {
                this.boxInfoList = items;
            }
        );
    }

}
