import {Component, Input} from '@angular/core';
import {isNilOrEmpty} from '@shared/util/util';
import {PatientChild} from '@shared/child/patient-child';

@Component({
    selector: 'app-children-list',
    templateUrl: './children-list.component.html',
    styleUrls: ['./children-list.component.scss']
})
export class ChildrenListComponent {

    @Input()
    public visitDate: Date;

    @Input()
    public children: Array<PatientChild>;

    protected isEmpty(): boolean {
        return isNilOrEmpty(this.children);
    }

}
