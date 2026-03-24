import {ChangeDetectionStrategy, Component, computed, inject, input} from '@angular/core';
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
    selector: 'app-related-visit-child',
    templateUrl: './related-visit-child.component.html',
    styleUrls: ['./related-visit-child.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RelatedVisitChildComponent {

    protected readonly filler = inject(VisitActivityFillerFactory).getService();

    public readonly visitedChild = input.required<VisitedChild>();

    protected readonly visitDate = this.filler.getVisitDate();
    protected readonly needCopyBtn = computed(() => this.filler.isChildCopyableToActualVisit(this.visitedChild().child.id)());

    protected copyChildToActualVisit(): void {
        this.filler.saveNewChild({childId: this.visitedChild().child.id, isParentThere: false}).subscribe();
    }

}
