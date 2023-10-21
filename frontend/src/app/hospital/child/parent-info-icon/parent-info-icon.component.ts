import {Component, Input} from '@angular/core';

@Component({
    selector: 'app-parent-info-icon',
    templateUrl: './parent-info-icon.component.html',
    styleUrls: ['./parent-info-icon.component.scss']
})
export class ParentInfoIconComponent {

    @Input()
    public isParentThere: boolean;

}
