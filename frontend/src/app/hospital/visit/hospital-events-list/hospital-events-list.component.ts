import {Component, Input} from '@angular/core';
import {HospitalVisit} from '@shared/hospital-visit/hospital-visit';
import {TableDataSource} from '@fe/app/util/table-data-source';
import {HospitalVisitStatus} from '@shared/hospital-visit/hospital-visit-status';

@Component({
    selector: 'app-hospital-events-list',
    templateUrl: './hospital-events-list.component.html',
    styleUrls: ['./hospital-events-list.component.scss']
})
export class HospitalEventsListComponent {

    protected readonly columns = ['date', 'department', 'participants', 'options'];

    @Input()
    public set eventsList(list: Array<HospitalVisit>) {
        this.tableDataSource.emit(list);
    }

    protected tableDataSource = new TableDataSource<HospitalVisit>();

    protected isFillButtonNeeded(visit: HospitalVisit): boolean {
        return [HospitalVisitStatus.SCHEDULED, HospitalVisitStatus.STARTED].includes(visit.status);
    }

}
