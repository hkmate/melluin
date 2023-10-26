import {Component, Input, OnInit} from '@angular/core';
import {VisitedChild} from '@shared/hospital-visit/visited-child';
import {HospitalVisitActivityFillerService} from '@fe/app/hospital/hospital-visit-activity-filler/hospital-visit-activity-filler.service';
import {Observable} from 'rxjs';

@Component({
    selector: 'app-related-visit-child',
    templateUrl: './related-visit-child.component.html',
    styleUrls: ['./related-visit-child.component.scss']
})
export class RelatedVisitChildComponent implements OnInit {

    @Input()
    public visitedChild: VisitedChild;

    protected visitDate: Date
    protected needCopyBtn$: Observable<boolean>;

    constructor(protected readonly filler: HospitalVisitActivityFillerService) {
    }

    public ngOnInit(): void {
        this.needCopyBtn$ = this.filler.isChildCopyableToActualVisit(this.visitedChild.child.id);
        this.visitDate = this.filler.getVisitDate();
    }

    protected copyChildToActualVisit(): void {
        this.filler.saveNewChild({childId: this.visitedChild.child.id, isParentThere: false}).subscribe();
    }

}
