import {Component, computed, input} from '@angular/core';
import {isNilOrEmpty, VisitedChild} from '@melluin/common';
import {ChildCardComponent} from '@fe/app/hospital/child/child-card/child-card.component';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
    selector: 'app-children-list',
    templateUrl: './children-list.component.html',
    imports: [
        ChildCardComponent,
        TranslatePipe
    ],
    styleUrls: ['./children-list.component.scss']
})
export class ChildrenListComponent {

    public readonly visitDate = input.required<Date>();
    public readonly children = input.required<Array<VisitedChild>>();
    public readonly noChild = computed(() => isNilOrEmpty(this.children()));

}
