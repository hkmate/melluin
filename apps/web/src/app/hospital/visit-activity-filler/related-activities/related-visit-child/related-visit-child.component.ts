import {Component, effect, inject, input} from '@angular/core';
import {VisitedChild} from '@melluin/common';
import {VisitActivityFillerService} from '@fe/app/hospital/visit-activity-filler/visit-activity-filler.service';
import {Observable} from 'rxjs';

@Component({
    selector: 'app-related-visit-child',
    templateUrl: './related-visit-child.component.html',
    styleUrls: ['./related-visit-child.component.scss']
})
export class RelatedVisitChildComponent {

    protected readonly filler = inject(VisitActivityFillerService);

    public readonly visitedChild = input.required<VisitedChild>();

    protected visitDate: Date
    protected needCopyBtn$: Observable<boolean>;

    constructor() {
        effect(() => {
            this.needCopyBtn$ = this.filler.isChildCopyableToActualVisit(this.visitedChild().child.id);
            this.visitDate = this.filler.getVisitDate();
        });
    }

    protected copyChildToActualVisit(): void {
        this.filler.saveNewChild({childId: this.visitedChild().child.id, isParentThere: false}).subscribe();
    }

}
