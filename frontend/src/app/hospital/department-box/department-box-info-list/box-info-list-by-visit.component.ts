import {Component, Input, OnInit} from '@angular/core';
import {DepartmentBoxStatus} from '@shared/department/box/department-box-status';
import {DepartmentBoxService} from '@fe/app/hospital/department-box/department-box.service';
import {DepartmentBoxInfoListComponent} from '@fe/app/hospital/department-box/department-box-info-list/department-box-info-list.component';

@Component({
    selector: 'app-box-info-list-by-visit',
    templateUrl: './department-box-info-list.component.html',
    styleUrls: ['./department-box-info-list.component.scss']
})
export class BoxInfoListByVisitComponent extends DepartmentBoxInfoListComponent implements OnInit {

    private actualVisitId: string;

    constructor(private readonly boxStatusService: DepartmentBoxService) {
        super();
    }

    @Input()
    public set visitId(visitId: string) {
        this.actualVisitId = visitId;
        this.loadData();
    }

    public ngOnInit(): void {
        this.paginatorNeeded = false;
    }

    protected override loadData(): void {
        this.boxStatusService.findBoxStatusesByVisit(this.actualVisitId).subscribe(
            (items: Array<DepartmentBoxStatus>) => {
                this.boxInfoList = items;
            }
        );
    }

}
