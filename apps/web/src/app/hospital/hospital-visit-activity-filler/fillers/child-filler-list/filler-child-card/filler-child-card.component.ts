import {Component, effect, inject, input, output} from '@angular/core';
import {VisitedChild} from '@shared/hospital-visit/visited-child';
import {HospitalVisitActivityFillerService} from '@fe/app/hospital/hospital-visit-activity-filler/hospital-visit-activity-filler.service';
import {Observable} from 'rxjs';

@Component({
    selector: 'app-filler-child-card',
    templateUrl: './filler-child-card.component.html',
    styleUrls: ['./filler-child-card.component.scss']
})
export class FillerChildCardComponent {

    protected readonly filler = inject(HospitalVisitActivityFillerService);

    public readonly child = input.required<VisitedChild>();

    public readonly editWanted = output<void>();
    public readonly removeWanted = output<void>();

    protected visitedChild: VisitedChild;
    protected visitDate: Date;
    protected deleteEnabled$: Observable<boolean>;

    constructor() {
        effect(() => {
            this.visitDate = this.filler.getVisitDate();
            this.deleteEnabled$ = this.filler.isChildDeletable(this.child().id);
        });
    }

}
