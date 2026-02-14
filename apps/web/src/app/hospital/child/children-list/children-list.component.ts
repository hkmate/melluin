import {Component, computed, input} from '@angular/core';
import {isNilOrEmpty} from '@shared/util/util';
import {VisitedChild} from '@shared/hospital-visit/visited-child';

@Component({
    selector: 'app-children-list',
    templateUrl: './children-list.component.html',
    styleUrls: ['./children-list.component.scss']
})
export class ChildrenListComponent {

    public readonly visitDate = input.required<Date>();
    public readonly children = input.required<Array<VisitedChild>>();
    public readonly noChild = computed(() => isNilOrEmpty(this.children()));

}
