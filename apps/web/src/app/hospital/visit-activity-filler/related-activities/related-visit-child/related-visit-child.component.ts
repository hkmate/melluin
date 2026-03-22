import {Component, effect, inject, input, signal} from '@angular/core';
import {VisitedChild} from '@melluin/common';
import {VisitActivityFillerService} from '@fe/app/hospital/visit-activity-filler/visit-activity-filler.service';
import {Observable, of} from 'rxjs';
import {MatCard, MatCardContent, MatCardHeader, MatCardSubtitle} from '@angular/material/card';
import {ChildAgePipe} from '@fe/app/hospital/child/child-age/child-age.pipe';
import {ParentInfoIconComponent} from '@fe/app/hospital/child/parent-info-icon/parent-info-icon.component';
import {AsyncPipe} from '@angular/common';
import {MatMiniFabButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';

@Component({
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
    selector: 'app-related-visit-child',
    templateUrl: './related-visit-child.component.html',
    styleUrls: ['./related-visit-child.component.scss']
})
export class RelatedVisitChildComponent {

    protected readonly filler = inject(VisitActivityFillerService);

    public readonly visitedChild = input.required<VisitedChild>();

    protected visitDate = signal<Date>(this.filler.getVisitDate());
    protected needCopyBtn$ = signal<Observable<boolean>>(of(false));

    constructor() {
        effect(() => {
            this.needCopyBtn$.set(this.filler.isChildCopyableToActualVisit(this.visitedChild().child.id));
        });
    }

    protected copyChildToActualVisit(): void {
        this.filler.saveNewChild({childId: this.visitedChild().child.id, isParentThere: false}).subscribe();
    }

}
