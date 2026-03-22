import {Component, effect, inject, input, output, signal} from '@angular/core';
import {VisitedChild} from '@melluin/common';
import {VisitActivityFillerService} from '@fe/app/hospital/visit-activity-filler/visit-activity-filler.service';
import {of} from 'rxjs';
import {MatCard, MatCardContent, MatCardHeader, MatCardSubtitle} from '@angular/material/card';
import {ChildAgePipe} from '@fe/app/hospital/child/child-age/child-age.pipe';
import {ParentInfoIconComponent} from '@fe/app/hospital/child/parent-info-icon/parent-info-icon.component';
import {MatMiniFabButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {AsyncPipe} from '@angular/common';

@Component({
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
    selector: 'app-filler-child-card',
    templateUrl: './filler-child-card.component.html',
    styleUrls: ['./filler-child-card.component.scss']
})
export class FillerChildCardComponent {

    protected readonly filler = inject(VisitActivityFillerService);

    public readonly child = input.required<VisitedChild>();

    public readonly editWanted = output<void>();
    public readonly removeWanted = output<void>();

    protected visitDate = signal<Date>(this.filler.getVisitDate());
    protected deleteEnabled$ = signal(of(false));

    constructor() {
        effect(() => {
            this.deleteEnabled$.set(this.filler.isChildDeletable(this.child().id));
        });
    }

}
