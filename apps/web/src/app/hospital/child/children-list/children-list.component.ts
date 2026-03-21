import {ChangeDetectionStrategy, Component, computed, input} from '@angular/core';
import {isNilOrEmpty, VisitedChild} from '@melluin/common';
import {ChildCardComponent} from '@fe/app/hospital/child/child-card/child-card.component';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
    imports: [
        ChildCardComponent,
        TranslatePipe
    ],
    selector: 'app-children-list',
    templateUrl: './children-list.component.html',
    styleUrls: ['./children-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChildrenListComponent {

    public readonly visitDate = input.required<Date>();
    public readonly children = input.required<Array<VisitedChild>>();
    public readonly noChild = computed(() => isNilOrEmpty(this.children()));

}
