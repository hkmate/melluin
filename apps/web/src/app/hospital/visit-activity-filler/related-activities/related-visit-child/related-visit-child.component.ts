import {Component, effect, inject, input} from '@angular/core';
import {VisitedChild} from '@melluin/common';
import {VisitActivityFillerService} from '@fe/app/hospital/visit-activity-filler/visit-activity-filler.service';
import {Observable} from 'rxjs';
import {MatCard, MatCardContent, MatCardHeader, MatCardSubtitle} from '@angular/material/card';
import {ChildAgePipe} from '@fe/app/hospital/child/child-age/child-age.pipe';
import {ParentInfoIconComponent} from '@fe/app/hospital/child/parent-info-icon/parent-info-icon.component';
import {AsyncPipe} from '@angular/common';
import {MatMiniFabButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';

@Component({
    selector: 'app-related-visit-child',
    templateUrl: './related-visit-child.component.html',
    imports: [
        MatCard,
        MatCardHeader,
        MatCardSubtitle,
        ChildAgePipe,
        ParentInfoIconComponent,
        AsyncPipe,
        MatMiniFabButton,
        MatIcon,
        MatCardContent
    ],
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
