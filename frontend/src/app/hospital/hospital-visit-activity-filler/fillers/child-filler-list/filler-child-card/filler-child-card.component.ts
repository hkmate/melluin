import {Component, EventEmitter, Input, Output} from '@angular/core';
import {VisitedChild} from '@shared/hospital-visit/visited-child';
import {HospitalVisitActivityFillerService} from '@fe/app/hospital/hospital-visit-activity-filler/hospital-visit-activity-filler.service';
import {Observable} from 'rxjs';

@Component({
    selector: 'app-filler-child-card',
    templateUrl: './filler-child-card.component.html',
    styleUrls: ['./filler-child-card.component.scss']
})
export class FillerChildCardComponent {

    @Output()
    public editWanted = new EventEmitter<void>();

    @Output()
    public removeWanted = new EventEmitter<void>();

    protected visitedChild: VisitedChild;
    protected visitDate: Date;
    protected deleteEnabled$: Observable<boolean>;

    @Input()
    public set child(child: VisitedChild) {
        this.visitedChild = child;
        this.visitDate = this.filler.getVisitDate();
        this.deleteEnabled$ = this.filler.isChildDeletable(child.id);
    }

    constructor(protected readonly filler: HospitalVisitActivityFillerService) {
    }

}
