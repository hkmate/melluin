import {Component, input} from '@angular/core';
import {MatIcon} from '@angular/material/icon';

@Component({
    selector: 'app-parent-info-icon',
    templateUrl: './parent-info-icon.component.html',
    imports: [MatIcon],
    styleUrls: ['./parent-info-icon.component.scss']
})
export class ParentInfoIconComponent {

    public readonly isParentThere = input.required<boolean>();

}
