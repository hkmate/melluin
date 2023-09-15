import {Component, Input} from '@angular/core';
import {isNilOrEmpty} from '@shared/util/util';
import {VisitedChild} from '@shared/hospital-visit/visited-child';

@Component({
    selector: 'app-children-list',
    templateUrl: './children-list.component.html',
    styleUrls: ['./children-list.component.scss']
})
export class ChildrenListComponent {

    @Input()
    public visitDate: Date;

    @Input()
    public children: Array<VisitedChild>;

    protected isEmpty(): boolean {
        return isNilOrEmpty(this.children);
    }

}
