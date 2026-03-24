import {ChangeDetectionStrategy, Component, computed, inject, input, output} from '@angular/core';
import {VisitedChild} from '@melluin/common';
import {MatCard, MatCardContent, MatCardHeader, MatCardSubtitle} from '@angular/material/card';
import {ChildAgePipe} from '@fe/app/hospital/child/child-age/child-age.pipe';
import {ParentInfoIconComponent} from '@fe/app/hospital/child/parent-info-icon/parent-info-icon.component';
import {MatMiniFabButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {VisitActivityFillerFactory} from '@fe/app/hospital/visit-activity-filler/visit-activity-filler.factory';

@Component({
    imports: [
        MatCard,
        MatCardHeader,
        MatCardSubtitle,
        ChildAgePipe,
        ParentInfoIconComponent,
        MatMiniFabButton,
        MatIcon,
        MatCardContent
    ],
    selector: 'app-filler-child-card',
    templateUrl: './filler-child-card.component.html',
    styleUrls: ['./filler-child-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FillerChildCardComponent {

    protected readonly filler = inject(VisitActivityFillerFactory).getService();

    public readonly child = input.required<VisitedChild>();

    public readonly editWanted = output<void>();
    public readonly removeWanted = output<void>();

    protected visitDate = this.filler.getVisitDate();
    protected deleteEnabled = computed(() => this.filler.isChildDeletable(this.child().id)());

}
