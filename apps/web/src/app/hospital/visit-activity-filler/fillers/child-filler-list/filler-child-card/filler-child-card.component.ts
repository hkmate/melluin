import {Component, effect, inject, input, output} from '@angular/core';
import {VisitedChild} from '@melluin/common';
import {VisitActivityFillerService} from '@fe/app/hospital/visit-activity-filler/visit-activity-filler.service';
import {Observable} from 'rxjs';
import {MatCard, MatCardContent, MatCardHeader, MatCardSubtitle} from '@angular/material/card';
import {ChildAgePipe} from '@fe/app/hospital/child/child-age/child-age.pipe';
import {ParentInfoIconComponent} from '@fe/app/hospital/child/parent-info-icon/parent-info-icon.component';
import {MatMiniFabButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {AsyncPipe} from '@angular/common';

@Component({
    selector: 'app-filler-child-card',
    templateUrl: './filler-child-card.component.html',
    imports: [
        MatCard,
        MatCardHeader,
        MatCardSubtitle,
        ChildAgePipe,
        ParentInfoIconComponent,
        MatMiniFabButton,
        MatIcon,
        AsyncPipe,
        MatCardContent
    ],
    styleUrls: ['./filler-child-card.component.scss']
})
export class FillerChildCardComponent {

    protected readonly filler = inject(VisitActivityFillerService);

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
