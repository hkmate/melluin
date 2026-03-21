import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {MatIcon} from '@angular/material/icon';

@Component({
    imports: [MatIcon],
    selector: 'app-parent-info-icon',
    templateUrl: './parent-info-icon.component.html',
    styleUrls: ['./parent-info-icon.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ParentInfoIconComponent {

    public readonly isParentThere = input.required<boolean>();

}
